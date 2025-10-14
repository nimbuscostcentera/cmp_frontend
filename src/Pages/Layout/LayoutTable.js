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
import useLayout10Master from "../../Store/MasterStore/useLayout10Master";
import useLayout11Master from "../../Store/MasterStore/useLayout11Master";
import useLayout12Master from "../../Store/MasterStore/useLayout12Master";
import useLayout13Master from "../../Store/MasterStore/useLayout13Master";

function LayoutTable({
  Col,
  setIsDisable,
  search,
  setTextDetail,
  type, // mastertype (like 'im', 'um', etc.)
  layout,
  currentMaster,// layout string (like 'layout1', 'layout8', etc.)
  layoutData: items = [],
}) {
  const editInputRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({});

  // ✅ All layout hooks map
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
    layout10: useLayout10Master(),
    layout11: useLayout11Master(),
    layout12: useLayout12Master(),
    layout13: useLayout13Master(),
  };

  const layoutKey = layout || "layout1";
  const activeHook = hooks[layoutKey] || {};

  // ✅ Safe dynamic function detection
  const fnName = layoutKey.charAt(0).toUpperCase() + layoutKey.slice(1); // Layout1, Layout2...
  const updateFn = activeHook[`update${fnName}`];
  const deleteFn = activeHook[`delete${fnName}`];
  const fetchFn = activeHook[`fetch${fnName}`];

  // ✅ Extract states
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

  // ✅ Smart ID detector (works for any layout)
  const getIdField = (obj) => {
    if (!obj) return null;
    const key = Object.keys(obj).find(
      (k) => k.toLowerCase().endsWith("_id") || k === "ID"
    );
    return key ? obj[key] : null;
  };

  // ✅ Normalize columns
  const normalizedCols = Col?.map((col) => ({
    fieldname: col.name,
    label: col.label,
    width: col.width?.replace("w-[", "").replace("]", "") || "120px",
    max: col.maxLength,
    type: "text",
  }));

  // ✏️ Edit
  const ActionFunc = (tabIndex) => {
    const selected = filteredData[tabIndex];
    if (!selected) return;
    setParams({ IsAction: true, ActionID: tabIndex });
    setEditedData({ ...selected });
    setIsDisable(true);
    setTimeout(() => editInputRef.current?.focus?.(), 50);
  };

  // 💾 Save
  const SaveChange = () => {
    const missingField = Col.find(
      (f) =>
        editedData?.[f.name] === undefined ||
        editedData?.[f.name] === null ||
        editedData?.[f.name] === ""
    );
    if (missingField) {
      toast.error(`${missingField.label} is required`);
      return;
    }

    const idField = getIdField(editedData);
    if (!idField) {
      toast.error("Unable to determine ID for update");
      return;
    }

    if (typeof updateFn === "function") {
      updateFn(type, idField, editedData);
    } else {
      toast.error("Update function not found for this layout");
    }
  };

  // 🗑️ Delete
  const handleDelete = (tabIndex) => {
    const obj = filteredData[tabIndex];
    const idField = getIdField(obj);
    if (!idField) {
      toast.error("Unable to determine ID for delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete this item?")) {
      if (typeof deleteFn === "function") {
        deleteFn(type, idField);
      } else {
        toast.error("Delete function not found for this layout");
      }
    }
  };

  // 🔍 Search
  useEffect(() => {
    const val = (search || "").toLowerCase();
    const filtered = (items || []).filter(
      (item) =>
        (item.Code || "").toString().toLowerCase().includes(val) ||
        (item.Description || "").toString().toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, items]);

  // ✅ Update success
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success(`${currentMaster.name} updated successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({});
      setIsDisable(false);
      clearUpdateState && clearUpdateState();
      fetchFn && fetchFn(type); // refresh
    }
    if (updateError) {
      toast.error(updateError);
      clearUpdateState && clearUpdateState();
    }
  }, [updateIsSuccess, updateError]);

  // ✅ Delete success
  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success(`${currentMaster.name} deleted successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({});
      setIsDisable(false);
      clearDeleteState && clearDeleteState();
      fetchFn && fetchFn(type); // refresh after delete
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
        ActionFunc={ActionFunc}
        OnSaveHandler={SaveChange}
        handleDelete={handleDelete}
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
        height="40vh"
      />
    </div>
  );
}

export default LayoutTable;
