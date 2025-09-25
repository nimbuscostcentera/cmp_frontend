// Layout5Table.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout5Master from "../../Store/MasterStore/useLayout5Master";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";

function Layout5Table({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [mappedLayout5, setMappedLayout5] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  // ✅ State aligned with Django model
  const [editedData, setEditedData] = useState({
    Customer_ID: null,
    Customer_Name: "",
    Address1: "",
    Address2: "",
    Address3: "",
    Contact: "",
    ID_Type: "2", // Default: Customer
    CompanyID: 1,
    Type_name: "Customer",
  });

  const type = "csm"; // Customer Master
  const [CompanyID] = useState(1);

  // ✅ Options for ID_Type
  const typeArr = [
    { label: "1", value: "Self" },
    { label: "2", value: "Customer" },
  ];

  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item.value}`,
      value: item.label,
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

  // Map layout5 to include Type_name
  useEffect(() => {
    const mapped = layout5.map((item) => ({
      ...item,
      Type_name: item.ID_Type === "1" ? "Self" : "Customer",
    }));
    setMappedLayout5(mapped);
  }, [layout5]);

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        Customer_ID: selected.Customer_ID,
        Customer_Name: selected.Customer_Name,
        Address1: selected.Address1,
        Address2: selected.Address2,
        Address3: selected.Address3,
        Contact: selected.Contact,
        ID_Type: selected.ID_Type || "2",
        Type_name:
          selected.Type_name ||
          (selected.ID_Type === "1" ? "Self" : "Customer"),
        CompanyID: 1,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { Customer_Name, Contact, Customer_ID } = editedData;

    if (!Customer_Name) {
      toast.error("Name is mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(Customer_Name)) {
      toast.error("Name must be alphanumeric & max 100 chars");
      return;
    }

    for (let i = 1; i <= 3; i++) {
      if (
        editedData[`Address${i}`] &&
        !/^[a-zA-Z0-9 ]{0,100}$/.test(editedData[`Address${i}`])
      ) {
        toast.error(`Address line ${i} must be alphanumeric & max 100 chars`);
        return;
      }
    }

    if (Contact && !/^[a-zA-Z0-9]{1,30}$/.test(Contact)) {
      toast.error("Contact No must be alphanumeric & max 30 chars");
      return;
    }

    updateLayout5(type, Customer_ID, editedData);
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout5(type, obj.Customer_ID);
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();

    const filtered = mappedLayout5.filter(
      (c) =>
        c.Customer_Name?.toLowerCase().includes(val) ||
        c.Address1?.toLowerCase().includes(val) ||
        c.Address2?.toLowerCase().includes(val) ||
        c.Address3?.toLowerCase().includes(val) ||
        c.Contact?.toLowerCase().includes(val) ||
        c.Type_name?.toLowerCase().includes(val)
    );

    setFilteredData(filtered);
  }, [search, mappedLayout5]);

  // Fetch list
  useEffect(() => {
    fetchLayout5(type);
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Customer Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Customer_ID: null,
        Customer_Name: "",
        Address1: "",
        Address2: "",
        Address3: "",
        Contact: "",
        ID_Type: "2",
        Type_name: "Customer",
        CompanyID: 1,
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

  // ✅ Columns aligned with Django model
  const Col = [
    {
      headername: "Name",
      fieldname: "Customer_Name",
      type: "String",
      width: "150px",
    },
    { headername: "Address 1", fieldname: "Address1", type: "String" },
    { headername: "Address 2", fieldname: "Address2", type: "String" },
    { headername: "Address 3", fieldname: "Address3", type: "String" },
    { headername: "Contact No", fieldname: "Contact", type: "String" },
    {
      headername: "Type Name",
      fieldname: "Type_name",
      selectionname: "ID_Type",
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
