// pages/LayoutMaster/LayoutTable.js
import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";

// Import all layout hooks
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";
import useLayout3Master from "../../Store/MasterStore/useLayout3Master";
import useLayout4Master from "../../Store/MasterStore/useLayout4Master";
import useLayout5Master from "../../Store/MasterStore/useLayout5Master";
import useLayout6Master from "../../Store/MasterStore/useLayout6Master";
import useLayout7Master from "../../Store/MasterStore/useLayout7Master";
import useLayout8Master from "../../Store/MasterStore/useLayout8Master";
import useLayout9Master from "../../Store/MasterStore/useLayout9Master";

function LayoutTable({
  Col,
  setIsDisable,
  search,
  setTextDetail,
  type, // mastertype (e.g. 'im', 'um' etc)
  layout, // layout string (e.g. 'layout1', 'layout9')
  layoutData: items = [],
}) {
  const editInputRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({});

  // All layout hooks
  const hooks = {
    layout1: useLayout1Master(),
    layout2: useLayout2Master(),
    layout3: useLayout3Master(),
    layout4: useLayout4Master(),
    layout5: useLayout5Master(),
    layout6: useLayout6Master(),
    layout7: useLayout7Master(),
    layout8: useLayout8Master(),
    layout9: useLayout9Master(),
  };

  // Determine active hook using the layout prop (not master type)
  const layoutKey = layout || "layout1";
  const activeHook = hooks[layoutKey] || {};

  // Dynamic functions: (store naming convention: updateLayout1, deleteLayout1, etc.)
  const updateFn = activeHook[`update${layoutKey.charAt(0).toUpperCase() + layoutKey.slice(1)}`];
  const deleteFn = activeHook[`delete${layoutKey.charAt(0).toUpperCase() + layoutKey.slice(1)}`];

  // Extract states from active hook
  const {
    updateIsLoading,
    updateError,
    updateIsSuccess,
    clearUpdateState,
    deleteIsLoading,
    deleteError,
    deleteIsSuccess,
    clearDeleteState,
    fetchIsLoading,
  } = activeHook;

  // Normalize columns
  const normalizedCols = Col?.map((col) => ({
    fieldname: col.name,
    label: col.label,
    width: col.width?.replace("w-[", "").replace("]", "") || "120px",
    max: col.maxLength,
    type: "text",
  }));

  // Edit action
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
    // focus to edit input if present
    setTimeout(() => editInputRef.current?.focus?.(), 50);
  };

  // Save changes
 const SaveChange = () => {
  // ✅ Dynamic required field check
  const missingField = Col.find((f) => {
    const val = editedData?.[f.name];
    return val === undefined || val === null || val === "";
  });

  if (missingField) {
    toast.error(`${missingField.label} is required`);
    return;
  }

  // Optional — only validate Code/Description if they exist
  if (editedData.Code && !/^[a-zA-Z0-9]{1,6}$/.test(editedData.Code)) {
    toast.error("Code must be max 6 alphanumeric chars");
    return;
  }
  if (editedData.Description && !/^[a-zA-Z0-9 ]{1,15}$/.test(editedData.Description)) {
    toast.error("Description must be max 15 chars");
    return;
  }

  if (typeof updateFn === "function") {
    const idField =
      editedData.ID ||
      editedData.Unit_ID ||
      editedData.Year_ID ||
      editedData.Company_ID ||
      editedData.User_ID;

    if (!idField) {
      toast.error("Unable to determine ID for update");
      return;
    }

    // store signature expects (type, id, updatedData)
    updateFn(type, idField, editedData);
  } else {
    toast.error("Update function not found for this layout");
    console.warn(`Update function not found for layout: ${layoutKey}`);
  }
};


  // Delete action
  const handleDelete = (tabIndex) => {
    const obj = filteredData[tabIndex];
    const idField = obj?.ID || obj?.Unit_ID || obj?.Year_ID || obj?.Company_ID || obj?.User_ID;
    if (!idField) {
      toast.error("Unable to determine ID for delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete this item?")) {
      if (typeof deleteFn === "function") {
        // store signature expects (type, id)
        deleteFn(type, idField);
      } else {
        toast.error("Delete function not found for this layout");
        console.warn(`Delete function not found for layout: ${layoutKey}`);
      }
    }
  };

  // Search filter
  useEffect(() => {
    const val = (search || "").toLowerCase();
    const filtered = (items || []).filter(
      (item) =>
        (item.Code || "").toString().toLowerCase().includes(val) ||
        (item.Description || "").toString().toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, items]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success(`${type} updated successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({});
      setIsDisable(false);
      clearUpdateState && clearUpdateState();
    }
    if (updateError) {
      toast.error(updateError);
      clearUpdateState && clearUpdateState();
    }
  }, [updateIsSuccess, updateError]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success(`${type} deleted successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({});
      setIsDisable(false);
      clearDeleteState && clearDeleteState();
    }
    if (deleteError) {
      toast.error(deleteError);
      clearDeleteState && clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError]);

  return (
    <div className="table-box">
      <Table
        tab={filteredData || []}
        Col={normalizedCols}
        isAction={params.IsAction}
        ActionId={params.ActionID}
        ActionFunc={ActionFunc} // Edit
        OnSaveHandler={SaveChange} // Save
        handleDelete={handleDelete} // Delete
        OnChangeHandler={(i, e) =>
          setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
