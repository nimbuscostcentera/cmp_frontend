// Layout3Table.js
import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useFetchColorMaster from "../../Store/ShowStore/useFetchColorMaster";
import useEditColorMaster from "../../Store/UpdateStore/useEditColorMaster";
import useDeleteColorMaster from "../../Store/DeleteMasterStore/useDeleteColorMaster";
import useAddColorMaster from "../../Store/AddStore/useAddColorMaster";

function Layout3Table({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: null,
    CODE: "",
    NAME: "",
    ADDRESS1: "",
    ADDRESS2: "",
    ADDRESS3: "",
    CONTACT: "",
  });

  const [CompanyID] = useState(1);

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
        CODE: selected.CODE,
        NAME: selected.NAME,
        ADDRESS1: selected.ADDRESS1,
        ADDRESS2: selected.ADDRESS2,
        ADDRESS3: selected.ADDRESS3,
        CONTACT: selected.CONTACT,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { CODE, NAME, CONTACT } = editedData;

    if (!CODE || !NAME) {
      toast.error("Code and Name are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(CODE)) {
      toast.error("Code must be alphanumeric & max 6 chars");
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
    if (CONTACT && !/^\d{10}$/.test(CONTACT)) {
      toast.error("Contact No must be 10 digits only");
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
        c.CODE?.toLowerCase().includes(val) ||
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
      toast.success("Artisan Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        ID: null,
        CODE: "",
        NAME: "",
        ADDRESS1: "",
        ADDRESS2: "",
        ADDRESS3: "",
        CONTACT: "",
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
    { headername: "Code", fieldname: "CODE", type: "String", width: "100px" },
    { headername: "Name", fieldname: "NAME", type: "String", width: "150px" },
    { headername: "Address 1", fieldname: "ADDRESS1", type: "String" },
    { headername: "Address 2", fieldname: "ADDRESS2", type: "String" },
    { headername: "Address 3", fieldname: "ADDRESS3", type: "String" },
    { headername: "Contact No", fieldname: "CONTACT", type: "String" },
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

export default Layout3Table;
