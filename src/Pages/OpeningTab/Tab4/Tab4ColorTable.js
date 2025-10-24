import React, { useEffect, useRef, useState } from "react";
import Table from "../../../Components/Table";
import EstimateTable from "../../../Components/EstimateTable";
import { toast } from "react-toastify";
import useTab4ColorTable from "../../../Store/OpeningStore/useTab4ColorTable";
import useTab4Master from "../../../Store/OpeningStore/useTab4Master";

function Tab4ColorTable({ show, handleClose, colorOptions, selectedDesignId }) {
  const editInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);

  const [params, setParams] = useState({ IsAction: false, ActionID: -1 });
  const [editedData, setEditedData] = useState({
    ID: null,
    Color: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [rows, setRows] = useState([{ rowid: 1, Color: "" }]);
  const {
    fetchTab4,
  } = useTab4Master();
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
        Color: selected.Color,
      });
    }
  };

  // Handle cell change
  const OnCellChange = (i, e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited record
  // Save edited record
const SaveChange = async () => {
  if (!editedData.Color) {
    toast.error("Color is required");
    return;
  }

  try {
    // 1️⃣ Get all current colors from tab4ColorData
    const allColors = tab4ColorData.map((row) => ({ ...row }));

    // 2️⃣ Replace the color of the edited row
    const updatedColors = allColors.map(
      (row) =>
        row.ID === editedData.ID
          ? { ...row, Color: editedData.Color } // updated row
          : row // keep not edited rows as-is
    );

    // 3️⃣ Generate ColorS string from all updated Color values
    const colorString = updatedColors
      .map((row) => row.Color) // just the values
      .filter(Boolean) // remove empty/nulls
      .join(","); // combine into comma-separated string

    // 4️⃣ Add ColorS to payload
    const payload = {
      ...editedData,
      ColorS: colorString,
    };

    console.log(payload, "payload"); // for debugging



    // 5️⃣ Call update API
    await updateTab4Color("design_color", editedData.ID, payload);

    // toast.success("Color updated successfully with ColorS synced!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update color");
  }
};


  // Delete record
  const handleDelete = async (index) => {
    const obj = tab4ColorData[index];
    if (obj) await deleteTab4Color("design_color",obj.ID);
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
    setRows([...rows, { rowid: rows.length + 1, Color: "" }]);
  };

  const deleteRow = (rowid) => {
    const updated = rows.filter((r) => r.rowid !== rowid);
    updated.forEach((r, i) => (r.rowid = i + 1));
    setRows(updated);
  };

  const isFormValid = () => {
    for (const row of rows) {
      if (!row.Color) {
        toast.error("Color is required in all rows.");
        return false;
      }
    }
    return true;
  };

  const saveNewRows = async () => {
    if (!isFormValid()) return;
    await addTab4Color("design_color",selectedDesignId, rows);
    setShowAddForm(false);
    setRows([{ rowid: 1, Color: "" }]);
    fetchTab4Color("design_color", selectedDesignId);
  };

  // Toast notifications
  useEffect(() => {
    if (addIsSuccess) {
      toast.success("Record added successfully");
      clearAddState();
      fetchTab4Color("design_color", selectedDesignId);
       fetchTab4("design_header");
    } else if (addError) {
      toast.error(addError);
      clearAddState();
    }

    if (updateIsSuccess) {
      toast.success("Record updated successfully");
      clearUpdateState();
      fetchTab4Color("design_color", selectedDesignId);
       fetchTab4("design_header");
      setParams({ IsAction: false, ActionID: -1 });
    } else if (updateError) {
      toast.error(updateError);
      clearUpdateState();
    }

    if (deleteIsSuccess) {
      toast.success("Record deleted successfully");
      clearDeleteState();
      fetchTab4Color("design_color", selectedDesignId);
       fetchTab4("design_header");
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
      selectionname: "Color",
      isSelection: true,
      options: colorOptions,
      width: "150px",
    },
  ];

  const detailColumns = [
    {
      label: "Color",
      key: "Color",
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
