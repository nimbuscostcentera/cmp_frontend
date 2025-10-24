import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../../Components/ReusableModal";
import EstimateTable from "../../../Components/EstimateTable";

function Tab4Stone({
  show,
  handleClose,
  rows,
  setRows,
  stoneMainOptions,
  stoneSubOptions,
  colorOptions,
}) {
  const srlColInputRef = useRef();
  const [localRows, setLocalRows] = useState([]);

  // 🧩 Initialize rows
  useEffect(() => {
    if (show) {
      if (rows && rows.length > 0) {
        setLocalRows([...rows]);
      } else {
        setLocalRows([
          {
            rowid: 1,
            Srl: 1,
            ID_StoneM: null,
            ID_StoneS: null,
            ID_Color: null,
            Pcs: "",
            Weight: "",
            PhysicalPcs: "",
          },
        ]);
      }
    }
  }, [show]);

  // ➕ Add new row
  const addRow = () => {
    const newRowId = (localRows?.length || 0) + 1;
    setLocalRows([
      ...localRows,
      {
        rowid: newRowId,
        Srl: newRowId,
        ID_StoneM: null,
        ID_StoneS: null,
        ID_Color: null,
        Pcs: "",
        Weight: "",
        PhysicalPcs: "",
      },
    ]);
  };

  // ❌ Delete row
  const deleteRow = (rowid) => {
    setLocalRows(localRows.filter((r) => r.rowid !== rowid));
  };

  // 🧠 Handle field change
  const handleStoneChange = (rowIndex, key, e) => {
    const value = e?.target ? e.target.value : e;
    const updatedRows = [...localRows];
    const row = { ...updatedRows[rowIndex], [key]: value };

    // Get selected StoneSub object (contains Weight info)
    const stoneSubObj = stoneSubOptions?.find((s) => s.value === row.ID_StoneS);

    // Auto-calculate Weight = StoneSub.Weight × Pcs
    if (stoneSubObj && row.Pcs) {
      row.Weight = (Number(stoneSubObj.Weight) * Number(row.Pcs)).toFixed(3);
    } else {
      row.Weight = "";
    }

    updatedRows[rowIndex] = row;
    setLocalRows(updatedRows);
  };

  // ✅ Save stones
  const saveStones = () => {
    if (localRows.length === 0) {
      toast.error("No stone data to save");
      return;
    }

    // 🧾 Mandatory fields validation (StoneMain, StoneSub, Color, Pcs)
    const filteredRows = localRows.filter(
      (r) => r.ID_StoneM && r.ID_StoneS && r.ID_Color && r.Pcs
    );

    if (filteredRows.length === 0) {
      toast.error("Please fill mandatory fields in at least one row");
      return;
    }

    // ❌ Prevent duplicate (StoneMain + StoneSub + Color)
    const comboKeys = filteredRows.map(
      (r) => `${r.ID_StoneM}-${r.ID_StoneS}-${r.ID_Color}`
    );
    const hasDuplicates = new Set(comboKeys).size !== comboKeys.length;
    if (hasDuplicates) {
      toast.error("Duplicate Stone Main + Stone Sub + Color not allowed");
      return;
    }

    // ⚠️ Validate PhysicalPcs ≤ Pcs
    const invalidPcs = filteredRows.find(
      (r) => r.PhysicalPcs && Number(r.PhysicalPcs) > Number(r.Pcs)
    );
    if (invalidPcs) {
      toast.error("Physical Pcs cannot exceed total Pcs");
      return;
    }

    // ✅ Pass cleaned data back to parent
    setRows(filteredRows);
    handleClose();
  };

  // 🔹 Define table columns
  const stoneColumns = [
    {
      label: "Stone Main *",
      key: "ID_StoneM",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Stone Main",
      data: stoneMainOptions || [],
      width: "180px",
    },
    {
      label: "Stone Sub *",
      key: "ID_StoneS",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Stone Sub",
      data: stoneSubOptions || [],
      width: "180px",
    },
    {
      label: "Color *",
      key: "ID_Color",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Color",
      data: colorOptions || [],
      width: "150px",
    },
    {
      label: "Pcs *",
      key: "Pcs",
      type: "number",
      width: "100px",
    },
    {
      label: "Weight (Auto)",
      key: "Weight",
      readOnly: true,
      width: "120px",
    },
    {
      label: "Physical Pcs",
      key: "PhysicalPcs",
      type: "number",
      width: "120px",
    },
  ];

  return (
    <ReusableModal
      isFullScreen
      show={show}
      Title="Stone Details"
      isPrimary
      isSuccess
      handleClose={handleClose}
      handlePrimary={saveStones}
      handleSuccess={addRow}
      SuccessButtonName="Add Stone"
      PrimaryButtonName="Save"
      body={
        <EstimateTable
          columns={stoneColumns}
          rows={localRows}
          handleChange={handleStoneChange}
          deleteRow={deleteRow}
          isDelete
          id="rowid"
          toaster={toast}
          priorityref={srlColInputRef}
          tableWidth="100%"
        />
      }
    />
  );
}

export default Tab4Stone;
