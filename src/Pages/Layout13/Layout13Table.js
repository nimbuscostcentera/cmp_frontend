import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout13Master from "../../Store/MasterStore/useLayout13Master";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";

function Layout13Table({ setIsDisable, search, setTextDetail, type }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  // Local state for editing
  const [editedData, setEditedData] = useState({
    Company_ID: null,
    Company_Code: "",
    Company_Name: "",
    GSTIN: "",
    Active: true,
    Address: "",
    Contact: "",
  });

  // Zustand store
  const {
    layout13,
    fetchLayout13,
    fetchIsLoading,
    addIsSuccess,
    updateLayout13,
    updateIsSuccess,
    updateError,
    clearUpdateState,
    deleteLayout13,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useLayout13Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
  };

  // Save changes
  const SaveChange = () => {
    const { Company_ID, Company_Code, Company_Name, GSTIN } = editedData;

    if (!Company_Code || !Company_Name) {
      toast.error("Company Code & Name are required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,15}$/.test(Company_Code)) {
      toast.error("Company Code must be alphanumeric & max 15 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,50}$/.test(Company_Name)) {
      toast.error("Company Name must be alphanumeric & max 50 chars");
      return;
    }

    updateLayout13(type, Company_ID, editedData);
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout13(type, obj.Company_ID);
  };

  // Search filter
  useEffect(() => {
    const val = search?.toLowerCase();
    const filtered = layout13.filter(
      (c) =>
        c.Company_Code?.toLowerCase().includes(val) ||
        c.Company_Name?.toLowerCase().includes(val) ||
        c.GSTIN?.toLowerCase().includes(val) ||
        c.Address?.toLowerCase().includes(val) ||
        c.Contact?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, layout13]);

  // Fetch list
  useEffect(() => {
    fetchLayout13(type);
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Company Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Company_ID: null,
        Company_Code: "",
        Company_Name: "",
        GSTIN: "",
        Active: true,
        Address: "",
        Contact: "",
      });
      setIsDisable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // Handle delete
  useEffect(() => {
    if (deleteIsSuccess) toast.success("Deleted Successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  // Table Columns
  const Col = [
    {
      headername: "Company Code",
      fieldname: "Company_Code",
      type: "String",
      width: "150px",
    },
    {
      headername: "Company Name",
      fieldname: "Company_Name",
      type: "String",
      width: "200px",
    },
    { headername: "GSTIN", fieldname: "GSTIN", type: "String", width: "150px" },
    {
      headername: "Address",
      fieldname: "Address",
      type: "String",
      width: "250px",
    },
    {
      headername: "Contact",
      fieldname: "Contact",
      type: "String",
      width: "150px",
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={filteredData || []}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={(e) => {
          const { name, value, type, checked } = e.target;
          if (name === "Contact") {
            if (value.length > 10 || !PhnoValidation(value)) {
              return;
            }
          }
          setEditedData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
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
        height={"45vh"}
      />
    </div>
  );
}

export default Layout13Table;
