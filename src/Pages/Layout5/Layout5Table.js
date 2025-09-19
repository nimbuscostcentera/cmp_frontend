// Layout4Table.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useFetchColorMaster from "../../Store/ShowStore/useFetchColorMaster";
import useEditColorMaster from "../../Store/UpdateStore/useEditColorMaster";
import useDeleteColorMaster from "../../Store/DeleteMasterStore/useDeleteColorMaster";
import useAddColorMaster from "../../Store/AddStore/useAddColorMaster";

function Layout5Table({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  const [editedData, setEditedData] = useState({
    ID: null,
    NAME: "",
    ADDRESS1: "",
    ADDRESS2: "",
    ADDRESS3: "",
    CONTACT: "",
    id_master: 2, // default Customer
  });

  const [CompanyID] = useState(1);

  const typeArr = [
    { label: 1, value: "Self" },
    { label: 2, value: "Customer" },
  ];

  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item?.value}`,
      value: item?.label,
    }));
  }, [typeArr]);

  const { ColorMasterList, fetchColorMaster, isColorMasterLoading } =
    useFetchColorMaster();
  const {
    EditColorMasterFunc,
    ColorMasterEditSuccess,
    ColorMasterEditError,
    ClearStateEditColorMaster,
  } = useEditColorMaster();
  const {
    DeleteColorMaster,
    ColorMasterDeleteMsg,
    ColorMasterDeleteErr,
    ClearColorMasterDelete,
  } = useDeleteColorMaster();
  const { ColorMasterSuccess } = useAddColorMaster();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        ID: selected.ID,
        NAME: selected.NAME,
        ADDRESS1: selected.ADDRESS1,
        ADDRESS2: selected.ADDRESS2,
        ADDRESS3: selected.ADDRESS3,
        CONTACT: selected.CONTACT,
        id_master: selected.id_master || 2,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { NAME, CONTACT } = editedData;

    if (!NAME) {
      toast.error("Name is mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(NAME)) {
      toast.error("Name must be alphanumeric & max 100 chars");
      return;
    }

    for (let i = 1; i <= 3; i++) {
      if (
        editedData[`ADDRESS${i}`] &&
        !/^[a-zA-Z0-9 ]{0,100}$/.test(editedData[`ADDRESS${i}`])
      ) {
        toast.error(`Address line ${i} must be alphanumeric & max 100 chars`);
        return;
      }
    }

    if (CONTACT && !/^[a-zA-Z0-9]{1,30}$/.test(CONTACT)) {
      toast.error("Contact No must be alphanumeric & max 30 chars");
      return;
    }

    EditColorMasterFunc({ ...editedData, CompanyID });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) DeleteColorMaster({ CompanyID, ID: obj.ID });
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = ColorMasterList.filter(
      (c) =>
        c.NAME?.toLowerCase().includes(val) ||
        c.ADDRESS1?.toLowerCase().includes(val) ||
        c.ADDRESS2?.toLowerCase().includes(val) ||
        c.ADDRESS3?.toLowerCase().includes(val) ||
        c.CONTACT?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, ColorMasterList]);

  // Fetch list
  useEffect(() => {
    fetchColorMaster({ CompanyID });
  }, [ColorMasterSuccess]);

  // Handle edit success/error
  useEffect(() => {
    if (ColorMasterEditSuccess) {
      toast.success("Customer Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        ID: null,
        NAME: "",
        ADDRESS1: "",
        ADDRESS2: "",
        ADDRESS3: "",
        CONTACT: "",
        id_master: 2,
      });
      setIsDisable(false);
    }
    if (ColorMasterEditError) toast.error(ColorMasterEditError);
    ClearStateEditColorMaster();
  }, [ColorMasterEditSuccess, ColorMasterEditError]);

  // Handle delete
  useEffect(() => {
    if (ColorMasterDeleteMsg) toast.success(ColorMasterDeleteMsg);
    if (ColorMasterDeleteErr) toast.error(ColorMasterDeleteErr);
    ClearColorMasterDelete();
  }, [ColorMasterDeleteMsg, ColorMasterDeleteErr]);

  const Col = [
    { headername: "Name", fieldname: "NAME", type: "String", width: "150px" },
    { headername: "Address 1", fieldname: "ADDRESS1", type: "String" },
    { headername: "Address 2", fieldname: "ADDRESS2", type: "String" },
    { headername: "Address 3", fieldname: "ADDRESS3", type: "String" },
    { headername: "Contact No", fieldname: "CONTACT", type: "String" },
    {
      headername: "ID Type",
      fieldname: "id_master",
      selectionname: "id_master",
      type: "String",
      isSelection: true,
      options: typeList,
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={filteredData || []}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={(i, e) =>
          setEditedData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        OnSaveHandler={SaveChange}
        getFocusText={(val) => {
          setTextDetail(val);
        }}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={isColorMasterLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        height={"40vh"}
      />
    </div>
  );
}

export default Layout5Table;
