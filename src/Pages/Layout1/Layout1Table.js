// pages/Layout1Master/Layout1Table.js
import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";

function Layout1Table({ setIsDisable, search, setTextDetail, type }) {
  const editInputRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: "",
    Code: "",
    Description: "",
  });

  const {
    layout1: items,
    fetchLayout1,
    updateLayout1,
    deleteLayout1,

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
  } = useLayout1Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        ID: selected.ID,
        Code: selected.Code,
        Description: selected.Description,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { Code, Description, ID } = editedData;
    if (!Code || !Description) {
      toast.error("Both fields are required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Code)) {
      toast.error("Code max 6 alphanumeric");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description max 15 alphanumeric");
      return;
    }
    updateLayout1(type, ID, { Code, Description });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout1(type, obj.ID);
  };

  // Filter data based on search
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.Code?.toLowerCase().includes(val) ||
        item.Description?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, items]);

  // Fetch items on mount or type change
  useEffect(() => {
    if (type) fetchLayout1(type);
  }, [type]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess && !updateIsLoading && !updateError) {
      toast.success(`${type} updated successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({ ID: "", Code: "", Description: "" });
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
      toast.success(`${type} deleted successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({ ID: "", Code: "", Description: "" });
      setIsDisable(false);
      clearDeleteState();
    }
    if (deleteError && !deleteIsLoading && !deleteIsSuccess) {
      toast.error(deleteError);
      clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError, deleteIsLoading]);

  const Col = [
    { headername: "Code", fieldname: "Code", type: "String", width: "120px" },
    { headername: "Description", fieldname: "Description", type: "String" },
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

export default Layout1Table;
