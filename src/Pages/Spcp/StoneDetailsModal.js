import React, { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../Components/ReusableModal";
import EstimateTable from "../../Components/EstimateTable";

function StoneDetailsModal({
  show,
  handleClose,
  rows,
  setRows,
  mischargelist,
}) {
  const srlPrnInputRef = useRef();

  // Local state for unsaved edits
  const [localRows, setLocalRows] = useState([]);

  // ✅ Copy existing rows or create one blank when modal opens
  useEffect(() => {
    if (show) {
      if (rows && rows.length > 0) {
        setLocalRows([...rows]);
      } else {
        setLocalRows([
          {
            rowid: 1,
            srl_Prn: 1,
            ID_MiscCharge: null,
            Amount: 0,
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
        srl_Prn: newRowId,
        ID_MiscCharge: null,
        Amount: 0,
      },
    ]);
  };

  // ❌ Delete row
  const deleteRow = (rowid) => {
    setLocalRows(localRows.filter((r) => r.rowid !== rowid));
  };

  // 🧾 Handle cell changes
  const handleDetailModalChange = (rowIndex, colKey, e) => {
    let value = e?.target ? e.target.value : e;

    if (colKey === "Amount") {
      const regex = /^\d{0,6}(\.\d{0,2})?$/; // up to 6 digits + 2 decimal places
      if (value !== "" && !regex.test(value)) return;
    }

    const updatedRows = [...localRows];
    const obj = { ...updatedRows[rowIndex] };
    obj[colKey] = value;
    updatedRows[rowIndex] = obj;
    setLocalRows(updatedRows);
  };

  // ✅ Save only when Save button is clicked
  const saveItem = () => {
    if (localRows.length === 0) {
      setRows([]);
    } else {
      setRows(localRows);
    }
    handleClose();
  };

  // ❌ Close modal without saving
  const handleModalClose = () => {
    handleClose();
  };

  // 🔹 Dropdown options
  const miscChargeOptions = useMemo(
    () =>
      mischargelist.map((item) => ({
        label: `${item.Code}: ${item.Description}`,
        value: item.ID,
      })),
    [mischargelist]
  );

  // 🧩 Table columns
  const detailColumns = [
    {
      label: "Misc Charge",
      key: "ID_MiscCharge",
      AutoSearch: true,
      SearchLabel: "label",
      SearchValue: "value",
      PlaceHolder: "Select Misc Charge",
      data: miscChargeOptions,
      width: "200px",
    },
    {
      label: "Amount",
      key: "Amount",
      type: "number",
      width: "150px",
    },
  ];

  return (
    <ReusableModal
      isFullScreen
      show={show}
      Title="Stone Details"
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
          priorityref={srlPrnInputRef}
          tableWidth="100%"
        />
      }
    />
  );
}

export default StoneDetailsModal;
