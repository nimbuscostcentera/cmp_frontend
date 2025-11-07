import React, { useEffect, useRef, useState } from "react";
import Table from "../../../Components/Table";
import { toast } from "react-toastify";

// Import all layout hooks
import useLayout1Master from "../../../Store/MasterStore/useLayout1Master";
import useLayout2Master from "../../../Store/MasterStore/useLayout2Master";
import useLayout3Master from "../../../Store/MasterStore/useLayout3Master";
import useLayout4Master from "../../../Store/MasterStore/useLayout4Master";
import useLayout5Master from "../../../Store/MasterStore/useLayout5Master";
import useLayout6Master from "../../../Store/MasterStore/useLayout6Master";
import useLayout7Master from "../../../Store/MasterStore/useLayout7Master";
import useLayout8Master from "../../../Store/MasterStore/useLayout8Master";
import useLayout9Master from "../../../Store/MasterStore/useLayout9Master";
import useLayout10Master from "../../../Store/MasterStore/useLayout10Master";
import useLayout11Master from "../../../Store/MasterStore/useLayout11Master";
import useLayout12Master from "../../../Store/MasterStore/useLayout12Master";
import useLayout13Master from "../../../Store/MasterStore/useLayout13Master";
import useLayout14Master from "../../../Store/MasterStore/useLayout14Master";

function LayoutTable({
  Col,
  setIsDisable,
  search,
  setTextDetail,
  type,
  layout,
  currentMaster,
  layoutData: items = [],
  foreignData = {}, // ✅ ADD THIS LINE
}) {
  const editInputRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({});
  const [codeSearch, setCodeSearch] = useState("");

  // All layout hooks map
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
    layout14: useLayout14Master(),
  };

  const layoutKey = layout || "layout1";
  const activeHook = hooks[layoutKey] || {};

  const fnName = layoutKey.charAt(0).toUpperCase() + layoutKey.slice(1);
  const updateFn = activeHook[`update${fnName}`];
  const deleteFn = activeHook[`delete${fnName}`];
  const fetchFn = activeHook[`fetch${fnName}`];

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

  const getIdField = (obj) => {
    if (!obj) return null;
    const key = Object.keys(obj).find(
      (k) => k.toLowerCase().endsWith("_id") || k === "ID"
    );
    return key ? obj[key] : null;
  };

  // Normalize columns with foreignKey support
  const normalizedCols = Col?.map((col) => ({
    fieldname: col.name,
    label: col.label,
    width: col.width?.replace("w-[", "").replace("]", "") || "120px",
    max: col.maxLength,
    type: col.type || "text",
    required: col.required || false,
    foreignKey: col.foreignKey || null,
    foreignKeyCode: col.foreignKeyCode || null,
    optionValueField: col.optionValueField,
    optionLabelField: col.optionLabelField,
    foreignOptions: foreignData[col.name] || [],
    options: col.options || [], // ✅ ADD THIS LINE

    render:
      col.type === "checkbox"
        ? (value) => (
            <span className="text-green-600 font-bold text-center">
              {value ? "✔️" : ""}
            </span>
          )
        : undefined,
  }));

  // Edit row
  const ActionFunc = (tabIndex) => {
    const selected = filteredData[tabIndex];
    if (!selected) return;
    setParams({ IsAction: true, ActionID: tabIndex });
    setEditedData({ ...selected });
    setIsDisable(true);
    setTimeout(() => editInputRef.current?.focus?.(), 50);
  };

  // Save changes
  const SaveChange = () => {
    const missingField = Col.find(
      (f) =>
        f.required &&
        (editedData?.[f.name] === undefined ||
          editedData?.[f.name] === null ||
          editedData?.[f.name] === "")
    );
    if (missingField) {
      toast.error(`${missingField.label} cannot be empty`);
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

  // Delete row
  const handleDelete = (tabIndex) => {
    if (params.IsAction && params.ActionID === tabIndex) {
      toast.warn("Please save the changes before deleting this row");
      return;
    }

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

  useEffect(() => {
    const globalSearch = (search || "").toLowerCase();
    const codeText = codeSearch.toLowerCase();

    const filtered = (items || []).filter((item) => {
      // ✅ Apply your existing global search
      const matchesGlobal = Object.values(item).some(
        (v) =>
          v !== null &&
          v !== undefined &&
          v.toString().toLowerCase().includes(globalSearch)
      );

      // ✅ Code-only search
      const matchesCode = Object.entries(item).some(([key, val]) => {
        if (!key.toLowerCase().includes("code")) return false;
        return val?.toString().toLowerCase().includes(codeText);
      });

      // ✅ Must match BOTH searches
      return matchesGlobal && matchesCode;
    });

    setFilteredData(filtered);
  }, [search, codeSearch, items]);

  // Update success effect
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success(`${currentMaster?.name} updated successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({});
      setIsDisable(false);
      clearUpdateState && clearUpdateState();
      fetchFn && fetchFn(type);
    }
    if (updateError) {
      toast.error(updateError);
      clearUpdateState && clearUpdateState();
    }
  }, [updateIsSuccess, updateError]);

  // Delete success effect
  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success(`${currentMaster?.name} deleted successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({});
      setIsDisable(false);
      clearDeleteState && clearDeleteState();
      fetchFn && fetchFn(type);
    }
    if (deleteError) {
      toast.error(deleteError);
      clearDeleteState && clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError]);

  useEffect(() => {
    // When master changes, reset edit state
    setParams({ ActionID: -1, IsAction: false });
    setEditedData({});
    setIsDisable(false);
  }, [type, setIsDisable]);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          placeholder="Search Code..."
          className="border border-gray-300 rounded px-2 py-1 text-sm w-60"
          value={codeSearch}
          onChange={(e) => setCodeSearch(e.target.value)}
        />
      </div>
      <div className="table-box">
        <Table
          tab={filteredData || []}
          Col={normalizedCols}
          isAction={params.IsAction}
          ActionId={params.ActionID}
          ActionFunc={ActionFunc}
          OnSaveHandler={SaveChange}
          handleDelete={handleDelete}
          OnChangeHandler={(i, e) => {
            const { name, value, type, checked } = e.target;
            // ✅ Just update state — don't block typing or show warnings here
            setEditedData((prev) => ({
              ...prev,
              [name]: type === "checkbox" ? checked : value,
            }));
          }}
          getFocusText={(val) => setTextDetail(val)}
          isEdit={true}
          isDelete={true}
          EditedData={editedData}
          isLoading={updateIsLoading || deleteIsLoading || fetchIsLoading}
          useInputRef={editInputRef}
          height="40vh"
        />
      </div>
    </>
  );
}

export default LayoutTable;
