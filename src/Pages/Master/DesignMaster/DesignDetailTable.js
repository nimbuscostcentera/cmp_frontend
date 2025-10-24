import React, { useEffect, useRef, useState } from "react";
import Table from "../../../Components/Table";
import EstimateTable from "../../../Components/EstimateTable";
import { toast } from "react-toastify";
import useDesignDetail from "../../../Store/MasterStore/useDesignDetail";
import Table2 from "../../../Components/Table2";

function DesignDetailTable({
  type,
  selectedDesignId,
  sizeOptions,
  stoneMOptions,
  stoneSOptions,
}) {
  const editInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);

  const [rows, setRows] = useState([
    {
      rowid: 1,
      ID_Size: "",
      ID_StoneM: "",
      ID_StoneS: "",
      Pcs: "",
      Weight: "",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [params, setParams] = useState({ IsAction: false, ActionID: -1 });
  const [editedData, setEditedData] = useState({
    ID: null,
    ID_Size: "",
    ID_StoneM: "",
    ID_StoneS: "",
    Pcs: "",
    Weight: "",
  });

  const {
    DesignDetail,
    fetchDesignDetail,
    addDesignDetail,
    updateDesignDetail,
    deleteDesignDetail,
    fetchIsLoading,
    updateIsSuccess,
    updateError,
    deleteIsSuccess,
    deleteError,
    addIsSuccess,
    addError,
    clearAddState,
    clearUpdateState,
    clearDeleteState,
  } = useDesignDetail();

  // 🎯 Fetch details when header changes
  useEffect(() => {
    if (selectedDesignId && type) fetchDesignDetail(type, selectedDesignId);
  }, [selectedDesignId, type]);

  // 🎯 Edit action
  const ActionFunc = (index) => {
    setParams({ IsAction: true, ActionID: index });
    const selected = DesignDetail[index];
    if (selected) setEditedData({ ...selected });
  };

  // 🎯 Handle cell change
  const OnCellChange = (i, e) => {
    const { name, value } = e.target;

    setEditedData((prev) => {
      // 🪶 When Stone S changes → auto update Weight
      if (name === "ID_StoneS") {
        const selectedStoneS = stoneSOptions.find((s) => s.value == value);
        const weightS = selectedStoneS
          ? parseFloat(selectedStoneS.Weight || 0)
          : 0;

        return {
          ...prev,
          [name]: value,
          Weight: weightS.toFixed(2),
        };
      }

      // 🔄 For all other fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // 🎯 Save edited record
  const SaveChange = async () => {
    if (!editedData) {
      toast.error("No data to save");
      return;
    }

    // 1️⃣ Check if both Stone Master and Stone Sub are filled
    if (editedData.ID_StoneM && editedData.ID_StoneS) {
      // Mandatory fields except ID_Size
      if (
        editedData.Pcs === null ||
        editedData.Pcs === "" ||
        editedData.Pcs === 0 ||
        isNaN(editedData.Pcs) ||
        editedData.Weight === null ||
        editedData.Weight === "" ||
        editedData.Weight === 0 ||
        isNaN(editedData.Weight)
      ) {
        toast.error(
          "All fields (except Size) are mandatory for rows where Stone Master and Stone Sub are filled."
        );
        return;
      }
    }

    // 2️⃣ (Optional) If you want, you can check duplicates here too,
    // if you have access to all rows in the parent table
    // Example:
    // const duplicates = allRows.filter((row, index, self) => {
    //   return self.findIndex(r => r.ID_StoneM === row.ID_StoneM && r.ID_StoneS === row.ID_StoneS && r.ID_Size === row.ID_Size) !== index;
    // });
    // if (duplicates.length > 0) {
    //   toast.error("Duplicate entries are not allowed for the combination of Size + Stone Master + Stone Sub Master");
    //   return;
    // }

    // 3️⃣ Prepare payload and call API
    const payload = { ...editedData, ID_Header: selectedDesignId };
    try {
      await updateDesignDetail(type, editedData.ID, payload);
      toast.success("Design detail updated successfully");
    } catch (err) {
      toast.error("Failed to update design detail");
    }
  };

  // 🎯 Delete record
  const handleDelete = async (index) => {
    const obj = DesignDetail[index];
    if (obj) await deleteDesignDetail(type, obj.ID);
  };

  // 🎯 Handle new rows
  const handleDetailChange = (rowIndex, key, e) => {
    const value = e.target.value;
    const updatedRows = [...rows];
    const currentRow = updatedRows[rowIndex];
    currentRow[key] = value;
    currentRow.ID_Header = selectedDesignId;

    // 🪶 Auto-update Weight only when Stone S changes
    if (key === "ID_StoneS") {
      const selectedStoneS = stoneSOptions.find((s) => s.value === value);

      const weightS = selectedStoneS
        ? parseFloat(selectedStoneS.Weight || 0)
        : 0;

      currentRow.Weight = weightS.toFixed(2);
    }

    updatedRows[rowIndex] = currentRow;
    // console.log(updatedRows[rowIndex], "updatedRows");
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        rowid: rows.length + 1,
        ID_Size: "",
        ID_StoneM: "",
        ID_StoneS: "",
        Pcs: "",
        Weight: "",
      },
    ]);
  };

  const deleteRow = (rowid) => {
    const updated = rows.filter((r) => r.rowid !== rowid);
    updated.forEach((r, i) => (r.rowid = i + 1));
    setRows(updated);
  };

  // ✅ Custom validation rule
  const isFormValid = () => {
    for (const row of rows) {
      const hasStoneM = !!row.ID_StoneM;
      const hasStoneS = !!row.ID_StoneS;
      const hasItem = !!row.ID_Item; // If "Item" column exists later, handled here

      // If any of Item / Stone M / Stone S exists → all fields (except Size) required
      if (hasStoneM || hasStoneS || hasItem) {
        if (!row.Pcs || !row.Weight) {
          toast.error(
            "If Item or Stone Main or Stone Sub exists, the full line must be filled (except Size)."
          );
          return false;
        }
      }
    }

    return true;
  };
  const isFormValid1 = () => {
    for (const row of rows) {
      if (!row.ID_Size || !row.ID_StoneM || !row.ID_StoneS || !row.Weight) {
        return false; // ❌ Return false if any required field is missing
      }
    }
    return true; // ✅ All fields are filled
  };

  const saveNewRows = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Attach header ID to all rows
    const payload = rows.map((row) => ({
      ...row,
      // ID_Header: selectedDesignId,
    }));

    // ✅ Send all rows at once
    await addDesignDetail(type, payload, selectedDesignId);

    // ✅ Reset form
    setShowAddForm(false);
    setRows([
      {
        rowid: 1,
        ID_Size: "",
        ID_StoneM: "",
        ID_StoneS: "",
        Pcs: "",
        Weight: "",
      },
    ]);

    // ✅ Refetch data after saving
    await fetchDesignDetail(type, selectedDesignId);
  };

  // 🎯 Toast notifications
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Detail updated successfully!");
      clearUpdateState();
      fetchDesignDetail(type, selectedDesignId);
      setParams({ IsAction: false, ActionID: -1 });
    } else if (updateError) {
      toast.error(updateError);
      clearUpdateState();
    }
  }, [updateIsSuccess, updateError]);

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Detail deleted successfully!");
      clearDeleteState();
      fetchDesignDetail(type, selectedDesignId);
    } else if (deleteError) {
      toast.error(deleteError);
      clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError]);

  useEffect(() => {
    if (addIsSuccess) {
      toast.success("New detail added!");
      clearAddState();
      fetchDesignDetail(type, selectedDesignId);
    } else if (addError) {
      toast.error(addError);
      clearAddState();
    }
  }, [addIsSuccess, addError]);

  // 🧱 Columns for main table
  const Col = [
    {
      headername: "Size",
      fieldname: "Size_Name",
      selectionname: "ID_Size",
      isSelection: true,
      options: sizeOptions,
      width: "180px",
    },
    {
      headername: "Stone M",
      fieldname: "StoneM_Name",
      selectionname: "ID_StoneM",
      isSelection: true,
      options: stoneMOptions,
      width: "180px",
    },
    {
      headername: "Stone S",
      fieldname: "StoneS_Name",
      selectionname: "ID_StoneS",
      isSelection: true,
      options: stoneSOptions,
      width: "180px",
    },
    { headername: "Pcs", fieldname: "Pcs", type: "number", width: "100px" },
    {
      headername: "Weight",
      fieldname: "Weight",
      type: "number",
      width: "120px",
      isReadOnly: true,
    },
  ];

  // 🧱 Columns for add form
  const detailColumns = [
    // { label: "Srl", key: "Srl_Col", type: "number", width: "80px" },
    {
      label: "Size",
      key: "ID_Size",
      AutoSearch: true,
      data: sizeOptions,
      width: "180px",
      PlaceHolder: "Select Size",
    },
    {
      label: "Stone M",
      key: "ID_StoneM",
      AutoSearch: true,
      data: stoneMOptions,
      width: "180px",
      PlaceHolder: "Select Stone M",
    },
    {
      label: "Stone S",
      key: "ID_StoneS",
      AutoSearch: true,
      data: stoneSOptions,
      width: "180px",
      PlaceHolder: "Select Stone S",
    },
    {
      label: "Pcs",
      key: "Pcs",
      type: "number",
      width: "100px",
      PlaceHolder: "Enter Pcs",
    },
    {
      label: "Weight",
      key: "Weight",
      type: "number",
      width: "120px",
      PlaceHolder: "Enter Weight",
    },
  ];

  return (
    <div className="table-box">
      <Table2
        tab={DesignDetail}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={OnCellChange}
        OnSaveHandler={SaveChange}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={fetchIsLoading}
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
            <h5>Add New Design Details</h5>
            <div>
              <button className="btn btn-success me-2" onClick={addRow}>
                Add Row
              </button>
              <button
                className="btn btn-primary"
                onClick={saveNewRows}
                disabled={!isFormValid1()}
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

export default DesignDetailTable;
