// Layout4Table.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout4Master from "../../Store/MasterStore/useLayout4Master";
import useLayout7Master from "../../Store/MasterStore/useLayout7Master";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";

function Layout4Table({ setIsDisable, search, setTextDetail, type }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
    const { layout7 } = useLayout7Master();

    const dropdownList = useMemo(() => {
      return layout7.map((item) => ({
        label: `${item.Process_Code}`,
        value: item.Process_ID,
      }));
    }, [layout7]);

  // Edited Data State -> aligned with Layout4Master.js
  const [editedData, setEditedData] = useState({
    Staff_ID: null,
    Staff_Code: "",
    Staff_Name: "",
    Contact: "",
    ID_master: -1,
    Address1: "",
    Address2: "",
    Address3: "",
    type: type,
  });

  const {
    layout4,
    fetchLayout4,
    updateLayout4,
    deleteLayout4,

    addIsSuccess,

    // update
    updateIsSuccess,
    updateError,
    clearUpdateState,

    // delete
    deleteIsSuccess,
    deleteError,
    clearDeleteState,

    fetchIsLoading,
  } = useLayout4Master();

  // Enable Editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) {
      setEditedData({
        Staff_ID: selected.Staff_ID,
        Staff_Code: selected.Staff_Code,
        Staff_Name: selected.Staff_Name,
        Contact: selected.Contact,
        ID_master: selected.ID_master,
        Address1: selected.Address1,
        Address2: selected.Address2,
        Address3: selected.Address3,
        type: selected.type || type,
      });
    }
  };

  // Save changes
  const SaveChange = () => {
    const { Staff_Code, Staff_Name, Contact } = editedData;

    if (!Staff_Code || !Staff_Name) {
      toast.error("Code and Name are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Staff_Code)) {
      toast.error("Code must be alphanumeric & max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(Staff_Name)) {
      toast.error("Name must be alphanumeric & max 100 chars");
      return;
    }
  
    if (Contact && !/^\d{10}$/.test(Contact)) {
      toast.error("Contact No must be numeric & exactly 10 digits");
      return;
    }

    if (editedData.Staff_ID) {
      updateLayout4(type, editedData.Staff_ID, editedData);
    }
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    console.log("Deleting object:", obj);
    if (obj) deleteLayout4(type, obj.Staff_ID);
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = layout4.filter(
      (c) =>
        c.Staff_Code?.toLowerCase().includes(val) ||
        c.Staff_Name?.toLowerCase().includes(val) ||
        c.Address1?.toLowerCase().includes(val) ||
        c.Address2?.toLowerCase().includes(val) ||
        c.Address3?.toLowerCase().includes(val) ||
        c.Contact?.toLowerCase().includes(val) ||
        c.type?.toLowerCase().includes(val) ||
        (c.Process_Code?.toLowerCase().includes(val))
    );
    setFilteredData(filtered);
  }, [search, layout4]);

  // Fetch list whenever type changes
  useEffect(() => {
    fetchLayout4(type);
    // fetchLayout7();
  }, [type, deleteIsSuccess, updateIsSuccess, addIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Staff Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Staff_ID: null,
        Staff_Code: "",
        Staff_Name: "",
        Contact: "",
        ID_master: -1,
        Address1: "",
        Address2: "",
        Address3: "",
        type: type,
      });
      setIsDisable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess) toast.success("Deleted Successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  // Table Columns -> match Layout4Master.js
  const Col = [
    {
      headername: "Code",
      fieldname: "Staff_Code",
      type: "String",
      width: "100px",
    },
    {
      headername: "Name",
      fieldname: "Staff_Name",
      type: "String",
      width: "150px",
    },
    { headername: "Address 1", fieldname: "Address1", type: "String" },
    { headername: "Address 2", fieldname: "Address2", type: "String" },
    { headername: "Address 3", fieldname: "Address3", type: "String" },
    { headername: "Contact No", fieldname: "Contact", type: "String" },
    {
      headername: "Process",
      fieldname: "Process_Code",
      selectionname: "ID_master",
      type: "String",
      isSelection: true,
      options: dropdownList,
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={filteredData || []}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={(i, e) => {
          const { name, value } = e.target;
          if (name === "Contact") {
            if (value && value.length > 10) {
              return;
            }
            if (!PhnoValidation(value)) {
              return;
            }
          }

          setEditedData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }}
        OnSaveHandler={SaveChange}
        getFocusText={(val) => setTextDetail(val)}
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

export default Layout4Table;
