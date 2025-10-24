import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../../Components/ReusableModal";
import EstimateTable from "../../../Components/EstimateTable";

function DesignItemTypeModel({ show, handleClose, rows, setRows, itmOptions }) {
  const srlColInputRef = useRef();

  // Local state for unsaved edits
  const [localRows, setLocalRows] = useState([]);

  // When modal opens → copy existing rows but do NOT auto-add any
  useEffect(() => {
    if (show) {
      if (rows && rows.length > 0) {
        setLocalRows([...rows]);
      } else {
        setLocalRows([
          {
            rowid: 1,
            ID_ItemType: null,
            Approx_Gross_Weight: 0,
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
        ID_ItemType: null,
        Approx_Gross_Weight: 0,
      },
    ]);
  };

  // ❌ Delete a row
  const deleteRow = (rowid) => {
    setLocalRows(localRows.filter((r) => r.rowid !== rowid));
  };

  // Handle cell changes
  const handleDetailModalChange = (rowIndex, colKey, e) => {
    let value = e?.target ? e.target.value : e;
    const updatedRows = [...localRows];
    const obj = { ...updatedRows[rowIndex] };

    if (colKey === "Approx_Gross_Weight") {
      const regex = /^\d{0,7}(\.\d{0,3})?$/;
      if (value !== "" && !regex.test(value)) return;
    }

    obj[colKey] = value;
    updatedRows[rowIndex] = obj;
    setLocalRows(updatedRows);
  };

  // ✅ Save rows only when user clicks Save
  const saveItem = () => {
    if (localRows.length === 0) {
      setRows([]); // No data to save
    } else {
      setRows(localRows);
    }
    handleClose();
  };

  // ❌ Close modal without saving → discard local changes
  const handleModalClose = () => {
    handleClose();
  };

  // 🔹 Table columns
  const detailColumns = [
    {
      label: "Item Type",
      key: "ID_ItemType",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Item Type",
      data: itmOptions,
      width: "250px",
    },
    {
      label: "Approx Gross Weight",
      key: "Approx_Gross_Weight",
      type: "number",
      width: "180px",
    },
  ];

  return (
    <ReusableModal
      isFullScreen
      show={show}
      Title="Item Type Details"
      isPrimary
      isSuccess
      handleClose={handleModalClose} // ❌ Close without saving
      handlePrimary={saveItem} // ✅ Save rows to parent
      handleSuccess={addRow} // Add new row
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

export default DesignItemTypeModel;
