import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../../Components/ReusableModal";
import EstimateTable from "../../../Components/EstimateTable";

function Tab4Color({
  show,
  handleClose,
  rows,
  setRows,
  colorOptions,
  Color_Display,
}) {
  const srlColInputRef = useRef();

  // Local copy of rows for editing within modal
  const [localRows, setLocalRows] = useState([]);

  // Initialize modal with existing data or one empty row
  useEffect(() => {
    if (show) {
      if (rows && rows.length > 0) {
        setLocalRows([...rows]);
      } else {
        setLocalRows([
          {
            rowid: 1,
            Srl_Col: 1,
            Color: null,
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
        Srl_Col: newRowId,
        Color: null,
      },
    ]);
  };

  // ❌ Delete row
  const deleteRow = (rowid) => {
    setLocalRows(localRows.filter((r) => r.rowid !== rowid));
  };

  // Handle value change
  const handleColorChange = (rowIndex, colKey, e) => {
    const value = e?.target ? e.target.value : e;
    const updatedRows = [...localRows];
    updatedRows[rowIndex][colKey] = value;
    setLocalRows(updatedRows);
  };

  // ✅ Save color data to parent state
  const saveColors = () => {
    if (localRows.length === 0) {
      toast.error("No color data to save");
      return;
    }

    // Filter valid rows
    const filteredRows = localRows.filter((r) => r.Color);

    if (filteredRows.length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    // Prevent duplicate colors
    const colorIds = filteredRows.map((r) => r.Color);
    const hasDuplicates = new Set(colorIds).size !== colorIds.length;
    if (hasDuplicates) {
      toast.error("Duplicate colors are not allowed");
      return;
    }

    // ✅ Create comma-separated color names for display
    const colorNames = filteredRows
      .map((r) => {
        const colorObj = colorOptions?.find((c) => c.value === r.Color);
        return colorObj?.label || "";
      })
      .filter((name) => name.trim() !== "")
      .join(", ");
    const Color_Id = filteredRows
      .map((r) => r.Color)
      .filter((id) => id !== null)
    .join(",");

    // ✅ Pass both rows & display string to parent
    setRows(filteredRows, colorNames, Color_Id);

    handleClose();
  };

  // ❌ Close without saving
  const handleModalClose = () => {
    handleClose();
  };

  // 🔹 Table columns
  const colorColumns = [
    {
      label: "Color",
      key: "Color",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Color",
      data: colorOptions || [],
      width: "250px",
    },
  ];

  return (
    <ReusableModal
      isFullScreen
      show={show}
      Title="Color Details"
      isPrimary
      isSuccess
      handleClose={handleModalClose} // ❌ close modal
      handlePrimary={saveColors} // ✅ save valid rows
      handleSuccess={addRow} // ➕ add new color row
      SuccessButtonName="Add Color"
      PrimaryButtonName="Save"
      body={
        <EstimateTable
          columns={colorColumns}
          rows={localRows}
          handleChange={handleColorChange}
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

export default Tab4Color;
