// pages/Layout8Master/Layout8Table.js
import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout8Master from "../../Store/MasterStore/useLayout8Master";

function Layout8Table({ setIsDisable, search, setTextDetail, type }) {
  const editInputRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  // State for editing
  const [editedData, setEditedData] = useState({
    Polish_ID: "",
    Polish_Code: "",
    Description: "",
    Rate: "",
  });

  const {
    layout8: items,
    fetchLayout8,
    updateLayout8,
    deleteLayout8,

    // Add states
    addIsSuccess,

    // Update states
    updateIsLoading,
    updateError,
    updateIsSuccess,
    clearUpdateState,

    // Delete states
    deleteIsLoading,
    deleteError,
    deleteIsSuccess,
    clearDeleteState,

    // Fetch states
    fetchIsLoading,
  } = useLayout8Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        Polish_ID: selected.Polish_ID,
        Polish_Code: selected.Polish_Code,
        Description: selected.Description,
        Rate: selected.Rate,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { Polish_Code, Description, Rate, Polish_ID } = editedData;

    if (!Polish_Code || !Description || !Rate) {
      toast.error("All fields are required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Polish_Code)) {
      toast.error("Code must be max 6 alphanumeric");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description must be max 15 alphanumeric");
      return;
    }
    if (isNaN(Rate) || Number(Rate) <= 0) {
      toast.error("Rate must be a positive number");
      return;
    }

    updateLayout8(type, Polish_ID, { Polish_Code, Description, Rate });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout8(type, obj.Polish_ID);
  };

  // Filter data based on search
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.Polish_Code?.toLowerCase().includes(val) ||
        item.Description?.toLowerCase().includes(val) ||
        String(item.Rate).includes(val)
    );
    setFilteredData(filtered);
  }, [search, items]);

  // Fetch items on mount or type change
  useEffect(() => {
    if (type) fetchLayout8(type);
  }, [type, addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess && !updateIsLoading && !updateError) {
      toast.success(`Plating Polish updated successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Polish_ID: "",
        Polish_Code: "",
        Description: "",
        Rate: "",
      });
      setIsDisable(false);
      clearUpdateState();
    }
    if (updateError && !updateIsLoading && !updateIsSuccess) {
      toast.error(updateError);
      clearUpdateState();
    }
  }, [updateIsSuccess, updateError, updateIsLoading]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess && !deleteIsLoading && !deleteError) {
      toast.success(`Plating Polish deleted successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Polish_ID: "",
        Polish_Code: "",
        Description: "",
        Rate: "",
      });
      setIsDisable(false);
      clearDeleteState();
    }
    if (deleteError && !deleteIsLoading && !deleteIsSuccess) {
      toast.error(deleteError);
      clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError, deleteIsLoading]);

  const Col = [
    {
      headername: "Polish Code",
      fieldname: "Polish_Code",
      type: "String",
      width: "120px",
    },
    { headername: "Description", fieldname: "Description", type: "String" },
    { headername: "Rate", fieldname: "Rate", type: "Number", width: "100px" },
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
        getFocusText={(val) => setTextDetail(val)}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={updateIsLoading || deleteIsLoading || fetchIsLoading}
        useInputRef={editInputRef}
        isDelete={true}
        handleDelete={handleDelete}
        height={"40vh"}
      />
    </div>
  );
}

export default Layout8Table;
