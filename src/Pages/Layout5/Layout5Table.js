// Layout5Table.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout5Master from "../../Store/MasterStore/useLayout5Master";

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

  const type = "csm"; // <-- Customer Master
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

  const {
    layout5,
    fetchLayout5,
    updateLayout5,
    deleteLayout5,

    // States
    fetchIsLoading,
    addIsSuccess,
    updateIsSuccess,
    updateError,
    deleteIsSuccess,
    deleteError,

    clearUpdateState,
    clearDeleteState,
  } = useLayout5Master();

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
    const { NAME, CONTACT, ID } = editedData;

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

    updateLayout5(type, ID, { ...editedData, CompanyID });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout5(type, obj.ID);
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = layout5.filter(
      (c) =>
        c.NAME?.toLowerCase().includes(val) ||
        c.ADDRESS1?.toLowerCase().includes(val) ||
        c.ADDRESS2?.toLowerCase().includes(val) ||
        c.ADDRESS3?.toLowerCase().includes(val) ||
        c.CONTACT?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, layout5]);

  // Fetch list
  useEffect(() => {
    fetchLayout5(type);
  }, [addIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
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
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // Handle delete
  useEffect(() => {
    if (deleteIsSuccess) toast.success("Customer Deleted Successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

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
        isLoading={fetchIsLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        height={"40vh"}
      />
    </div>
  );
}

export default Layout5Table;
