import React, { useRef } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../Components/ReusableModal";
import EstimateTable from "../../Components/EstimateTable";

function StoneDetailsModal({ show, handleClose, headerId, rows, setRows }) {
  const srlPrnInputRef = useRef();

  // Add new row
  const addRow = () => {
    const newRowId = rows.length + 1;
    setRows([
      ...rows,
      {
        rowid: newRowId,
        srl_Prn: newRowId,
        ID_Header: headerId,
        ID_MiscCharge: null,
        DamageCharge: 0,
        SettingCharge: 0,
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
      Amount: /^(\d*\.?\d{0,2})?$/,
      DamageCharge: /^(\d*\.?\d{0,2})?$/,
      SettingCharge: /^(\d*\.?\d{0,2})?$/,
      Pcs: /^\d*$/,
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
  const miscChargeOptions = [
    { label: "Polish", value: 1 },
    { label: "Cutting", value: 2 },
    { label: "Stone Fitting", value: 3 },
  ];

  // Table columns
  const detailColumns = [
    {
      label: "SRL_PRN",
      key: "srl_Prn",
      type: "text",
      width: "65px",
      isReadOnly: true,
    },
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
      label: "Damage Charge",
      key: "DamageCharge",
      type: "number",
      width: "150px",
    },
    {
      label: "Setting Charge",
      key: "SettingCharge",
      type: "number",
      width: "150px",
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
