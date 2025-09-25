import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";

function LayoutTable({ Col, setIsDisable, search, setTextDetail, type, layoutData: items }) {
  const editInputRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({});

  const {
    fetchLayout1,
    updateLayout1,
    deleteLayout1,

    addIsSuccess,
    updateIsLoading,
    updateError,
    updateIsSuccess,
    clearUpdateState,
    deleteIsLoading,
    deleteError,
    deleteIsSuccess,
    clearDeleteState,
    fetchIsLoading,
  } = useLayout1Master();

  // 👉 Normalize columns
  const normalizedCols = Col?.map((col) => ({
    fieldname: col.name,
    label: col.label,
    width: col.width?.replace("w-[", "").replace("]", "") || "120px",
    max: col.maxLength,
    type: "text",
  }));

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
  };

  // Save changes
  const SaveChange = () => {
    if (!editedData?.Code || !editedData?.Description) {
      toast.error("Both fields are required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(editedData.Code)) {
      toast.error("Code max 6 alphanumeric");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(editedData.Description)) {
      toast.error("Description max 15 alphanumeric");
      return;
    }
    updateLayout1(type, editedData.ID, editedData);
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout1(type, obj.ID);
  };

  // Filter by search
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.Code?.toLowerCase().includes(val) ||
        item.Description?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, items]);

  // Fetch items
  useEffect(() => {
    if (type) fetchLayout1(type);
  }, [type, addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess && !updateIsLoading && !updateError) {
      toast.success(`${type} updated successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({});
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
      setEditedData({});
      setIsDisable(false);
      clearDeleteState();
    }
    if (deleteError && !deleteIsLoading && !deleteIsSuccess) {
      toast.error(deleteError);
      clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError, deleteIsLoading]);

  return (
    <div className="table-box">
      <Table
        tab={filteredData || []}
        Col={normalizedCols}
        isAction={params.IsAction}
        ActionId={params.ActionID}
        ActionFunc={ActionFunc}       // ✅ Edit
        OnSaveHandler={SaveChange}    // ✅ Save
        handleDelete={handleDelete}   // ✅ Delete
        OnChangeHandler={(i, e) =>
          setEditedData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        getFocusText={(val) => setTextDetail(val)}
        isEdit={true}
        isDelete={true}
        EditedData={editedData}
        isLoading={updateIsLoading || deleteIsLoading || fetchIsLoading}
        useInputRef={editInputRef}
        height={"40vh"}
      />
    </div>
  );
}

export default LayoutTable;
