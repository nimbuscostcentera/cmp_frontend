import React, { useEffect, useRef, useState } from "react";
import Table from "../../../Components/Table";
import EstimateTable from "../../../Components/EstimateTable";
import { toast } from "react-toastify";
import useTab4StoneTable from "../../../Store/OpeningStore/useTab4StoneTable";

function Tab4StoneTable({
  show,
  handleClose,
  sizeOptions,
  stoneMainOptions,
  stoneSubOptions,
  colorOptions,
  selectedDesignId,
}) {
  const editInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);

  const [params, setParams] = useState({ IsAction: false, ActionID: -1 });
  const [editedData, setEditedData] = useState({
    ID: null,
    ID_StoneM: "",
    ID_StoneS: "",
    ID_Color: "",
    Pcs: 0,
    Weight: 0,
    PhysicalPcs: 0, // ✅ added field
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [rows, setRows] = useState([
    {
      rowid: 1,
      ID_StoneM: "",
      ID_StoneS: "",
      ID_Color: "",
      Pcs: "",
      Weight: "",
      PhysicalPcs: "", // ✅ added field
    },
  ]);

  const {
    tab4StoneData,
    fetchTab4Stone,
    addTab4Stone,
    updateTab4Stone,
    deleteTab4Stone,
    fetchIsLoading,
    addIsSuccess,
    addError,
    updateIsSuccess,
    updateError,
    deleteIsSuccess,
    deleteError,
    clearAddState,
    clearUpdateState,
    clearDeleteState,
  } = useTab4StoneTable();

  // 🔹 Fetch data when modal opens
  useEffect(() => {
    if (show) fetchTab4Stone("design_stone", selectedDesignId);
  }, [show, updateIsSuccess, deleteIsSuccess]);

  // 🔹 Edit action
  const ActionFunc = (index) => {
    setParams({ IsAction: true, ActionID: index });
    const selected = tab4StoneData[index];
    if (selected) {
      setEditedData({
        ID: selected.ID,
        ID_StoneM: selected.ID_StoneM,
        ID_StoneS: selected.ID_StoneS,
        ID_Color: selected.ID_Color,
        Pcs: selected.Pcs,
        Weight: selected.Weight,
        PhysicalPcs: selected.PhysicalPcs || 0, // ✅ added
      });
    }
  };

  // 🔹 Handle cell change (Edit mode)
  const OnCellChange = (i, e) => {
    const { name, value } = e.target;
    setEditedData((prev) => {
      let updated = { ...prev, [name]: value };

      // ✅ Auto Weight Calculation: StoneSub.Weight × Pcs
      const stoneS = stoneSubOptions.find(
        (s) => s.value === (name === "ID_StoneS" ? value : prev.ID_StoneS)
      );
      if (stoneS && (name === "Pcs" || name === "ID_StoneS")) {
        const pcs = name === "Pcs" ? value : prev.Pcs;
        updated.Weight = (
          Number(stoneS.Weight || 0) * Number(pcs || 0)
        ).toFixed(3);
      }

      // ✅ Prevent PhysicalPcs > Pcs
      if (name === "PhysicalPcs" && Number(value) > Number(prev.Pcs)) {
        toast.error("Physical Pcs cannot exceed total Pcs");
        updated.PhysicalPcs = prev.Pcs;
      }

      return updated;
    });
  };

  // 🔹 Save edited record
const SaveChange = async () => {
  if (!editedData.ID_StoneM || !editedData.ID_StoneS || !editedData.Pcs) {
    toast.error("All fields are required");
    return;
  }

  // ⚠️ Validate that PhysicalPcs ≤ Pcs
  if (Number(editedData.PhysicalPcs) > Number(editedData.Pcs)) {
    toast.error("Physical Pcs cannot exceed total Pcs");
    return;
  }

  try {
    await updateTab4Stone("design_stone", editedData.ID, editedData);
    toast.success("Updated successfully");
  } catch (err) {
    toast.error("Failed to update");
  }
};


  // 🔹 Delete record
  const handleDelete = async (index) => {
    const obj = tab4StoneData[index];
    if (obj) await deleteTab4Stone("design_stone", obj.ID);
  };

  // 🔹 Handle new rows in add form
  const handleDetailChange = (rowIndex, key, e) => {
    const value = e.target.value;
    const updatedRows = [...rows];
    const currentRow = updatedRows[rowIndex];
    currentRow[key] = value;
    currentRow.ID_Header = selectedDesignId;

    // ✅ Auto Weight Calculation: StoneSub.Weight × Pcs
    const selectedStoneS = stoneSubOptions.find(
      (s) => s.value === currentRow.ID_StoneS
    );
    if (selectedStoneS && (key === "Pcs" || key === "ID_StoneS")) {
      currentRow.Weight = (
        Number(selectedStoneS.Weight || 0) * Number(currentRow.Pcs || 0)
      ).toFixed(3);
    }

    // ✅ Physical Pcs Validation
    if (
      key === "PhysicalPcs" &&
      Number(currentRow.PhysicalPcs) > Number(currentRow.Pcs)
    ) {
      toast.error("Physical Pcs cannot exceed total Pcs");
      currentRow.PhysicalPcs = currentRow.Pcs;
    }

    updatedRows[rowIndex] = currentRow;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        rowid: rows.length + 1,
        ID_StoneM: "",
        ID_StoneS: "",
        ID_Color: "",
        Pcs: "",
        Weight: "",
        PhysicalPcs: "", // ✅ added field
      },
    ]);
  };

  const deleteRow = (rowid) => {
    const updated = rows.filter((r) => r.rowid !== rowid);
    updated.forEach((r, i) => (r.rowid = i + 1));
    setRows(updated);
  };

  const isFormValid = () => {
    for (const row of rows) {
      if ((row.ID_StoneM || row.ID_StoneS) && (!row.Pcs || !row.Weight)) {
        toast.error(
          "If Stone M or Stone S is selected, Pcs and Weight are required."
        );
        return false;
      }
    }
    return true;
  };

  const saveNewRows = async () => {
    if (!isFormValid()) return;
    const payload = rows.map((row) => ({
      ...row,
      ID_Header: selectedDesignId,
    }));
    await addTab4Stone("design_stone",selectedDesignId, payload);
    setShowAddForm(false);
    setRows([
      {
        rowid: 1,
        ID_StoneM: "",
        ID_StoneS: "",
        ID_Color: "",
        Pcs: "",
        Weight: "",
        PhysicalPcs: "",
      },
    ]);
    fetchTab4Stone(selectedDesignId);
  };

  // 🔹 Toast notifications
  useEffect(() => {
    if (addIsSuccess) {
      toast.success("Record added successfully");
      clearAddState();
      fetchTab4Stone("design_stone", selectedDesignId);
    } else if (addError) {
      toast.error(addError);
      clearAddState();
    }

    if (updateIsSuccess) {
      toast.success("Record updated successfully");
      clearUpdateState();
       fetchTab4Stone("design_stone", selectedDesignId);
      setParams({ IsAction: false, ActionID: -1 });
    } else if (updateError) {
      toast.error(updateError);
      clearUpdateState();
    }

    if (deleteIsSuccess) {
      toast.success("Record deleted successfully");
      clearDeleteState();
        fetchTab4Stone("design_stone", selectedDesignId);
    } else if (deleteError) {
      toast.error(deleteError);
      clearDeleteState();
    }
  }, [
    addIsSuccess,
    addError,
    updateIsSuccess,
    updateError,
    deleteIsSuccess,
    deleteError,
  ]);

  const Col = [
    {
      headername: "Stone M",
      fieldname: "StoneM_name",
      selectionname: "ID_StoneM",
      isSelection: true,
      options: stoneMainOptions,
      width: "150px",
    },
    {
      headername: "Stone S",
      fieldname: "StoneS_name",
      selectionname: "ID_StoneS",
      isSelection: true,
      options: stoneSubOptions,
      width: "150px",
    },
    {
      headername: "Color",
      fieldname: "Color_name",
      selectionname: "ID_Color",
      isSelection: true,
      options: colorOptions,
      width: "120px",
    },
    { headername: "Pcs", fieldname: "Pcs", type: "number", width: "80px" },
    {
      headername: "Weight",
      fieldname: "Weight",
      type: "number",
      width: "100px",
      isReadOnly: true,
    },
    {
      headername: "Physical Pcs",
      fieldname: "PhysicalPcs",
      type: "number",
      width: "100px",
    },
  ];

  const detailColumns = [
    {
      label: "Stone M",
      key: "ID_StoneM",
      AutoSearch: true,
      data: stoneMainOptions,
      width: "150px",
      PlaceHolder: "Select Stone M",
    },
    {
      label: "Stone S",
      key: "ID_StoneS",
      AutoSearch: true,
      data: stoneSubOptions,
      width: "150px",
      PlaceHolder: "Select Stone S",
    },
    {
      label: "Color",
      key: "ID_Color",
      AutoSearch: true,
      data: colorOptions,
      width: "120px",
      PlaceHolder: "Select Color",
    },
    {
      label: "Pcs",
      key: "Pcs",
      type: "number",
      width: "100px",
      PlaceHolder: "Enter Pcs",
    },
    {
      label: "Weight (Auto)",
      key: "Weight",
      type: "number",
      readOnly: true,
      width: "100px",
      PlaceHolder: "Auto calculated",
    },
    {
      label: "Physical Pcs",
      key: "PhysicalPcs",
      type: "number",
      width: "100px",
      PlaceHolder: "Enter Physical Pcs",
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={tab4StoneData || []}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={OnCellChange}
        OnSaveHandler={SaveChange}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isDelete={true}
        handleDelete={handleDelete}
        isLoading={fetchIsLoading}
        useInputRef={editInputRef}
        height={"40vh"}
      />

      {/* Add new rows section */}
      <div className="d-flex justify-content-end mb-3 mt-2">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Hide Form" : "Add New Rows"}
        </button>
      </div>

      {showAddForm && (
        <div className="border p-3 mb-3">
          <div className="d-flex justify-content-between mb-3">
            <h5>Add New Stone Details</h5>
            <div>
              <button className="btn btn-success me-2" onClick={addRow}>
                Add Row
              </button>
              <button className="btn btn-primary" onClick={saveNewRows}>
                Save
              </button>
            </div>
          </div>

          {/* ✅ Make table horizontally scrollable */}
          <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            <EstimateTable
              columns={detailColumns}
              rows={rows}
              handleChange={handleDetailChange}
              deleteRow={deleteRow}
              isDelete={true}
              id="rowid"
              priorityref={srlPrnInputRef}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Tab4StoneTable;
