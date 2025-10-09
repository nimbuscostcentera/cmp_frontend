import React, { useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../Components/ReusableModal";
import EstimateTable from "../../Components/EstimateTable";
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";

function StoneDetailsModal({
  show,
  handleClose,
  headerId,
  rows,
  setRows,
  mischargelist,
}) {
  const srlPrnInputRef = useRef();

  // Add new row
  const addRow = () => {
    const newRowId = rows.length + 1;
    setRows([
      ...rows,
      {
        rowid: newRowId,
        srl_Prn: newRowId,
        ID_MiscCharge: null,
        Amount: 0,
      },
    ]);
  };

  // Delete row
  const deleteRow = (rowid) => {
    setRows(rows.filter((r) => r.rowid !== rowid));
  };

  // Handle field changes
  const handleDetailModalChange = (rowIndex, colKey, e) => {
    const regex = {
      Amount: /^\d{1,6}(\.\d{0,2})?$/,
    };

    let value = e?.target ? e.target.value : e;
    const updatedRows = [...rows];
    const obj = { ...updatedRows[rowIndex] };

    if (regex[colKey] && !regex[colKey].test(value)) {
      return;
    }

    obj[colKey] = value;
    updatedRows[rowIndex] = obj;
    setRows(updatedRows);
  };

  // Save rows back to parent
  const saveItem = () => {
    handleClose();
  };

  // Dropdown data (static for now)
  const miscChargeOptions = useMemo(
    () =>
      mischargelist.map((item) => ({
        label: `${item.Code}: ${item.Description}`,
        value: item.ID,
      })),
    [mischargelist]
  );

  // Table columns
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
      handleClose={handleClose}
      handlePrimary={saveItem}
      handleSuccess={addRow}
      SuccessButtonName="Add Row"
      PrimaryButtonName="Save"
      body={
        <EstimateTable
          columns={detailColumns}
          rows={rows}
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
