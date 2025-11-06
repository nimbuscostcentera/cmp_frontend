import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../../Components/ReusableModal";
import EstimateTable from "../../../Components/EstimateTable";

function DesignDetailsModel({
  show,
  handleClose,
  rows,
  setRows,
  stoneMOptions,
  stoneSOptions,
  sizeOptions,
}) {
  const srlColInputRef = useRef();

  // 🧠 Local state to manage temporary edits
  const [localRows, setLocalRows] = useState([]);

  // When modal opens → copy data to localRows and add one default row if empty
  useEffect(() => {
    if (show) {
      if (rows && rows.length > 0) {
        setLocalRows([...rows]);
      } else {
        setLocalRows([
          {
            rowid: 1,
            Srl_Col: 1,
            ID_StoneM: null,
            ID_StoneS: null,
            ID_Size: null,
            Pcs: 0,
            Weight: 0,
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
        ID_StoneM: null,
        ID_StoneS: null,
        ID_Size: null,
        Pcs: 0,
        Weight: 0,
      },
    ]);
  };

  // ❌ Delete row
  const deleteRow = (rowid) => {
    setLocalRows(localRows.filter((r) => r.rowid !== rowid));
  };

  // Handle cell changes
  const handleDetailModalChange = (rowIndex, colKey, e) => {
    let value = e?.target ? e.target.value : e;
    const updatedRows = [...localRows];
    const obj = { ...updatedRows[rowIndex] };

    if (colKey === "ID_StoneS") {
      obj[colKey] = value;
      const selectedSub = stoneSOptions.find((s) => s.value === value);
      if (selectedSub) {
        obj.Weight = selectedSub.Weight;
      }
      updatedRows[rowIndex] = obj;
      setLocalRows(updatedRows);
      return;
    }

    if (colKey === "Pcs") {
      const regex = /^[0-9]{0,6}$/;
      if (value !== "" && !regex.test(value)) return;
    }
    if (colKey === "Weight") {
      const regex = /^\d{0,6}(\.\d{0,3})?$/;
      if (value !== "" && !regex.test(value)) return;
    }

    obj[colKey] = value;
    updatedRows[rowIndex] = obj;
    setLocalRows(updatedRows);
  };

  // ✅ Save rows back to parent only when user clicks Save
const saveItem = () => {
  if (localRows.length === 0) {
    toast.error("No data to save");
    return;
  }

  // Filter out completely empty rows
  const filteredRows = localRows.filter((row) => {
    return (
      row.ID_StoneM ||
      row.ID_StoneS ||
      (row.Pcs && row.Pcs !== 0) ||
      (row.Weight && row.Weight !== 0)
    );
  });

  if (filteredRows.length === 0) {
    toast.error("No data to save");
    return;
  }

  // Validate required fields if both Stone Master and Stone Sub are filled
  const invalidRow = filteredRows.find((row) => {
    if (row.ID_StoneM && row.ID_StoneS) {
      // All fields except ID_Size must be filled
      return (
        row.Pcs === null ||
        row.Pcs === "" ||
        row.Pcs === 0 ||
        isNaN(row.Pcs) ||
        row.Weight === null ||
        row.Weight === "" ||
        row.Weight === 0 ||
        isNaN(row.Weight)
        // Add any other mandatory field checks here if needed
      );
    }
    return false; // row is partially filled or empty → ok
  });

  if (invalidRow) {
    toast.error(
      "All fields (except Size) are mandatory for rows where Stone Master and Stone Sub are filled."
    );
    return;
  }

  // Check for duplicates based on Size + Stone Master + Stone Sub
  const duplicates = filteredRows.filter((row, index, self) => {
    return (
      self.findIndex(
        (r) =>
          r.ID_StoneM === row.ID_StoneM &&
          r.ID_StoneS === row.ID_StoneS &&
          r.ID_Size === row.ID_Size
      ) !== index
    );
  });

  if (duplicates.length > 0) {
    toast.error(
      "Duplicate entries are not allowed for the combination of Size + Stone Master + Stone Sub Master"
    );
    return;
  }

  // Save only non-empty, valid, unique rows
  setRows(filteredRows);
  handleClose();
};





  // ❌ When modal closed without saving → discard all local changes
  const handleModalClose = () => {
    handleClose();
  };

  // 🔹 Table columns
  const detailColumns = [
    {
      label: "Stone Master",
      key: "ID_StoneM",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Stone Master",
      data: stoneMOptions,
      width: "200px",
    },
    {
      label: "Stone Sub",
      key: "ID_StoneS",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Stone Sub",
      data: stoneSOptions,
      width: "200px",
    },
    {
      label: "Size",
      key: "ID_Size",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Size",
      data: sizeOptions,
      width: "150px",
    },
    {
      label: "Pcs",
      key: "Pcs",
      type: "number",
      width: "100px",
    },
    {
      label: "Weight",
      key: "Weight",
      type: "number",
      width: "120px",
      readonly: true,
    },
  ];

  return (
    <ReusableModal
      isFullScreen
      show={show}
      Title="Stone Details"
      isPrimary
      isSuccess
      handleClose={handleModalClose} // ❌ closes without saving data
      handlePrimary={saveItem} // ✅ saves localRows to parent
      handleSuccess={addRow}
      SuccessButtonName="Add Row"
      PrimaryButtonName="Save"
      body={
        <EstimateTable
          columns={detailColumns}
          rows={localRows}
          handleChange={handleDetailModalChange}
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

export default DesignDetailsModel;
