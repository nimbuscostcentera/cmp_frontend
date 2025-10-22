import React, { useEffect, useRef, useState } from "react";
import Table from "../../../Components/Table";
import EstimateTable from "../../../Components/EstimateTable";
import { toast } from "react-toastify";
import useTab4ColorTable from "../../../Store/OpeningStore/useTab4ColorTable";

function Tab4ColorTable({ show, handleClose, colorOptions, selectedDesignId }) {
  const editInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);

  const [params, setParams] = useState({ IsAction: false, ActionID: -1 });
  const [editedData, setEditedData] = useState({
    ID: null,
    ID_Color: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [rows, setRows] = useState([{ rowid: 1, ID_Color: "" }]);

  const {
    tab4ColorData,
    fetchTab4Color,
    addTab4Color,
    updateTab4Color,
    deleteTab4Color,
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
  } = useTab4ColorTable();

  // Fetch data when modal opens
  useEffect(() => {
    if (show) fetchTab4Color("design_color", selectedDesignId);
  }, [show]);

  // Edit action
  const ActionFunc = (index) => {
    setParams({ IsAction: true, ActionID: index });
    const selected = tab4ColorData[index];
    if (selected) {
      setEditedData({
        ID: selected.ID,
        ID_Color: selected.ID_Color,
      });
    }
  };

  // Handle cell change
  const OnCellChange = (i, e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited record
  const SaveChange = async () => {
    if (!editedData.ID_Color) {
      toast.error("Color is required");
      return;
    }
    try {
      await updateTab4Color(editedData.ID, editedData);
    } catch {
      toast.error("Failed to update");
    }
  };

  // Delete record
  const handleDelete = async (index) => {
    const obj = tab4ColorData[index];
    if (obj) await deleteTab4Color(obj.ID);
  };

  // Handle new rows in add form
  const handleDetailChange = (rowIndex, key, e) => {
    const value = e.target.value;
    const updatedRows = [...rows];
    updatedRows[rowIndex][key] = value;
    updatedRows[rowIndex].ID_Header = selectedDesignId;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { rowid: rows.length + 1, ID_Color: "" }]);
  };

  const deleteRow = (rowid) => {
    const updated = rows.filter((r) => r.rowid !== rowid);
    updated.forEach((r, i) => (r.rowid = i + 1));
    setRows(updated);
  };

  const isFormValid = () => {
    for (const row of rows) {
      if (!row.ID_Color) {
        toast.error("Color is required in all rows.");
        return false;
      }
    }
    return true;
  };

  const saveNewRows = async () => {
    if (!isFormValid()) return;
    await addTab4Color(selectedDesignId, rows);
    setShowAddForm(false);
    setRows([{ rowid: 1, ID_Color: "" }]);
    fetchTab4Color("color", selectedDesignId);
  };

  // Toast notifications
  useEffect(() => {
    if (addIsSuccess) {
      toast.success("Record added successfully");
      clearAddState();
      fetchTab4Color("color", selectedDesignId);
    } else if (addError) {
      toast.error(addError);
      clearAddState();
    }

    if (updateIsSuccess) {
      toast.success("Record updated successfully");
      clearUpdateState();
      fetchTab4Color("color", selectedDesignId);
      setParams({ IsAction: false, ActionID: -1 });
    } else if (updateError) {
      toast.error(updateError);
      clearUpdateState();
    }

    if (deleteIsSuccess) {
      toast.success("Record deleted successfully");
      clearDeleteState();
      fetchTab4Color("color", selectedDesignId);
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
      headername: "Color",
      fieldname: "Color_name",
      selectionname: "ID_Color",
      isSelection: true,
      options: colorOptions,
      width: "150px",
    },
  ];

  const detailColumns = [
    {
      label: "Color",
      key: "ID_Color",
      AutoSearch: true,
      data: colorOptions,
      width: "150px",
      PlaceHolder: "Select Color",
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={tab4ColorData || []}
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
            <h5>Add New Color Details</h5>
            <div>
              <button className="btn btn-success me-2" onClick={addRow}>
                Add Row
              </button>
              <button className="btn btn-primary" onClick={saveNewRows}>
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

export default Tab4ColorTable;
