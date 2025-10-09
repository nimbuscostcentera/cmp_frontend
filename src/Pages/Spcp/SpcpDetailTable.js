import React, { useEffect, useRef, useState, useMemo } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import EstimateTable from "../../Components/EstimateTable";
import useSpcpDetails from "../../Store/MasterStore/useSpcpDetail";
import useSpcpMaster from "../../Store/MasterStore/useSpcpMaster";

function SpcpDetailTable({
  type,
  selectedSpcpId,
  dropdownListMiscCharge,
  headerCP,
}) {
  const editInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);

  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    type: "detail",
    ID: null,
    ID_MiscCharge: "",
    Amount: "",
    MisCharge_Name: "",
  });

  // Add new row states
  const [showAddForm, setShowAddForm] = useState(false);
  const [rows, setRows] = useState([
    { rowid: 1, ID_MiscCharge: "", Amount: "" },
  ]);

  const [currentSP, setCurrentSP] = useState(headerCP || 0);

  const {
    SpcpDetails,
    fetchSpcpDetails,
    updateSpcpDetails,
    deleteSpcpDetails,
    addSpcpDetails,
    fetchDetailsIsLoading,
    fetchDetailsIsSuccess,
    updateDetailsIsSuccess,
    updateDetailsError,
    deleteDetailsIsSuccess,
    deleteDetailsError,
    clearUpdateDetailsState,
    clearDeleteDetailsState,
  } = useSpcpDetails();

  const { fetchSpcp } = useSpcpMaster();

  // Fetch details when header changes
  useEffect(() => {
    if (selectedSpcpId && type) {
      fetchSpcpDetails(type, selectedSpcpId);
    }
  }, [selectedSpcpId, type]);

  // Filter related records and calculate SP
  useEffect(() => {
    if (fetchDetailsIsSuccess && SpcpDetails.length > 0) {
      const related = SpcpDetails.filter(
        (item) => item.ID_Header === selectedSpcpId
      );
      setFilteredData(related);

      const miscTotal = related.reduce(
        (acc, row) => acc + parseFloat(row.Amount || 0),
        0
      );
      setCurrentSP(parseFloat(headerCP || 0) + miscTotal);
    }
  }, [SpcpDetails, fetchDetailsIsSuccess, selectedSpcpId, headerCP]);

  // 🎯 Start editing a row
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
  };

  // 🎯 Handle cell change and recalc SP
  const OnCellChange = (i, e) => {
    const colKey = e.target.name;
    const value = e.target.value;
    if (colKey === "Amount" && value !== "") {
      const regex = /^\d{1,6}(\.\d{0,2})?$/; // up to 2 decimal places and before . 6 place can be filled
      if (!regex.test(value)) {
        return;
      }
    }

    const newEditedData = {
      ...editedData,
      [colKey]: value,
      ID_Header: selectedSpcpId,
    };
    setEditedData(newEditedData);

    const newFilteredData = [...filteredData];
    newFilteredData[i] = newEditedData;

    const miscTotal = newFilteredData.reduce(
      (acc, row) => acc + parseFloat(row.Amount || 0),
      0
    );
    setCurrentSP(parseFloat(headerCP || 0) + miscTotal);
  };

  // 🎯 Save updated row
  const SaveChange = async () => {
    const { ID, ID_MiscCharge, Amount } = editedData;

    if (!ID_MiscCharge) {
      toast.error("Misc Charge is required");
      return;
    }
    if (!Amount || isNaN(Amount)) {
      toast.error("Amount must be a valid number");
      return;
    }

    await updateSpcpDetails(type, ID, {
      ...editedData,
      ID_Header: selectedSpcpId,
      SP: currentSP,
    });
  };

  // 🎯 Delete record
  const handleDelete = async (index) => {
    const obj = filteredData[index];
    if (obj) await deleteSpcpDetails(type, obj.ID);
  };

  // 🎯 Watch for update feedback
  useEffect(() => {
    if (updateDetailsIsSuccess) {
      toast.success("Detail updated successfully");
      clearUpdateDetailsState();
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        type: "detail",
        ID: null,
        ID_MiscCharge: "",
        Amount: "",
        MisCharge_Name: "",
      });
      fetchSpcpDetails(type, selectedSpcpId);
      fetchSpcp("header");
    } else if (updateDetailsError) {
      toast.error(updateDetailsError);
      clearUpdateDetailsState();
    }
  }, [updateDetailsIsSuccess, updateDetailsError]);

  // 🎯 Watch for delete feedback
  useEffect(() => {
    if (deleteDetailsIsSuccess) {
      toast.success("Detail deleted successfully");
      clearDeleteDetailsState();
      fetchSpcpDetails(type, selectedSpcpId);
      fetchSpcp("header");
    } else if (deleteDetailsError) {
      toast.error(deleteDetailsError);
      clearDeleteDetailsState();
    }
  }, [deleteDetailsIsSuccess, deleteDetailsError]);
  useEffect(() => {
    if (deleteDetailsIsSuccess) {
      toast.success("Detail deleted successfully");
      clearDeleteDetailsState();
      fetchSpcpDetails(type, selectedSpcpId);
      fetchSpcp("header");
    } else if (deleteDetailsError) {
      toast.error(deleteDetailsError);
      clearDeleteDetailsState();
    }
  }, [deleteDetailsIsSuccess, deleteDetailsError]);

  // 🎯 Add New Row Feature
  const addRow = () => {
    const newRowId = rows.length + 1;
    setRows([
      ...rows,
      {
        rowid: newRowId,
        ID_MiscCharge: "",
        Amount: "",
      },
    ]);
  };

  const deleteRow = (rowid) => {
    const updatedRows = rows.filter((r) => r.rowid !== rowid);
    updatedRows.forEach((row, idx) => (row.rowid = idx + 1));
    setRows(updatedRows);
  };

  const handleDetailChange = (rowIndex, colKey, e) => {
    let value = e.target.value;
    if (colKey === "Amount" && value !== "") {
      const regex = /^\d{1,6}(\.\d{0,2})?$/; // up to 2 decimal places and before . 6 place can be filled
      if (!regex.test(value)) {
        return;
      }
    }

    const updatedRows = [...rows];
    updatedRows[rowIndex][colKey] = value;
    updatedRows[rowIndex].ID_Header = selectedSpcpId;
    setRows(updatedRows);
  };

  const isFormValid = () =>
    rows.every((row) => row.ID_MiscCharge && row.Amount);

  const saveNewRows = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields.");
      return;
    }

    await addSpcpDetails(type, rows, selectedSpcpId); // replace with your add API
    setShowAddForm(false);
    setRows([{ rowid: 1, ID_MiscCharge: "", Amount: "" }]);
    // ✅ Refetch details and header after successful add
    await fetchSpcpDetails(type, selectedSpcpId);
    await fetchSpcp("header");
  };

  // Dropdown options for misc charges
  const miscChargeOptions = useMemo(
    () =>
      dropdownListMiscCharge.map((item) => ({
        label: item.MisCharge_Name,
        value: item.ID,
      })),
    [dropdownListMiscCharge]
  );

  // Table columns
  const Col = [
    {
      headername: "Misc Charge",
      fieldname: "MisCharge_Name",
      selectionname: "ID_MiscCharge",
      width: "250px",
      isSelection: true,
      options: dropdownListMiscCharge,
    },
    {
      headername: "Amount",
      fieldname: "Amount",
      type: "number",
      width: "150px",
    },
  ];

  const detailColumns = [
    {
      label: "Misc Charge",
      key: "ID_MiscCharge",
      AutoSearch: true,
      data: dropdownListMiscCharge,
      width: "200px",
      PlaceHolder: "Select Misc Charge",
    },
    {
      label: "Amount",
      key: "Amount",
      type: "number",
      width: "150px",
      PlaceHolder: "Enter Amount",
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={filteredData}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={OnCellChange}
        OnSaveHandler={SaveChange}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={fetchDetailsIsLoading}
        useInputRef={editInputRef}
        isDelete={true}
        handleDelete={handleDelete}
        height={"45vh"}
      />
      <div className="d-flex justify-content-end mb-3">
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
            <h5>Add New SPCP Details</h5>
            <div>
              <button className="btn btn-success me-2" onClick={addRow}>
                Add Row
              </button>
              <button
                className="btn btn-primary"
                onClick={saveNewRows}
                disabled={!isFormValid()}
              >
                Save
              </button>
            </div>
          </div>

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
      )}
    </div>
  );
}

export default SpcpDetailTable;
