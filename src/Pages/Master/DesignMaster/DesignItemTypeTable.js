import React, { useEffect, useRef, useState } from "react";
import Table from "../../../Components/Table";
import EstimateTable from "../../../Components/EstimateTable";
import { toast } from "react-toastify";
import useDesignItemType from "../../../Store/MasterStore/useDesignItemType";
import Table2 from "../../../Components/Table2";

function DesignItemTypeTable({ type, selectedDesignId, itemTypeOptions }) {
  const editInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);

  const [rows, setRows] = useState([
    {
      rowid: 1,
      ID_ItemType: "",
      Approx_Gross_Weight: "",
      ID_Header: selectedDesignId,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [params, setParams] = useState({ IsAction: false, ActionID: -1 });
  const [editedData, setEditedData] = useState({
    ID: null,
    ID_ItemType: "",
    Approx_Gross_Weight: "",
    ID_Header: selectedDesignId,
  });

  const {
    DesignItemType,
    fetchDesignItemType,
    updateDesignItemType,
    deleteDesignItemType,
    addIsSuccess,
    addError,
    updateIsSuccess,
    addItemType,
    updateError,
    deleteIsSuccess,
    deleteError,
    fetchIsLoading,
    clearAddState,
    clearUpdateState,
    clearDeleteState,
    fetchError,
  } = useDesignItemType();

  // Fetch list when design or type changes
  useEffect(() => {
    if (selectedDesignId && type) {
      fetchDesignItemType(type, selectedDesignId);
    }
  }, [selectedDesignId, type]);

  // 🎯 Edit action
  const ActionFunc = (index) => {
    setParams({ IsAction: true, ActionID: index });
    const selected = DesignItemType[index];
    if (selected) setEditedData({ ...selected });
  };

  // 🎯 Handle cell change
  const OnCellChange = (i, e) => {
    const { name, value } = e.target;
    if (name === "Approx_Gross_Weight" && value !== "") {
      const regex = /^\d{1,6}\.?\d{0,3}$/; // up to 3 decimal places and before . 6 place can be filled
      if (!regex.test(value)) {
        return;
      }
    }
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
      ID_Header: selectedDesignId,
    }));
  };

  // 🎯 Save edited row
  const SaveChange = async () => {
    if (!editedData.ID_ItemType) {
      toast.error("Item Type is required");
      return;
    }
    const payload = {
      ID_ItemType: editedData.ID_ItemType,
      Approx_Gross_Weight: editedData.Approx_Gross_Weight,
      ID_Header: selectedDesignId,
    };
    await updateDesignItemType(type, editedData.ID, payload);
  };

  // 🎯 Delete row
  const handleDelete = async (index) => {
    const obj = DesignItemType[index];
    if (obj) await deleteDesignItemType(type, obj.ID);
  };

  // 🎯 Handle Add Form changes
  const handleDetailChange = (rowIndex, key, e) => {
    const value = e.target.value;

    if (key === "Approx_Gross_Weight" && value !== "") {
      const regex = /^\d{1,6}\.?\d{0,3}$/; // up to 3 decimal places and before . 6 place can be filled
      if (!regex.test(value)) {
        return;
      }
    }
    const updatedRows = [...rows];
    updatedRows[rowIndex][key] = value;
    updatedRows[rowIndex].ID_Header = selectedDesignId;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        rowid: rows.length + 1,
        ID_ItemType: "",
        Approx_Gross_Weight: "",
        ID_Header: selectedDesignId,
      },
    ]);
  };

  const deleteRow = (rowid) => {
    const updated = rows.filter((r) => r.rowid !== rowid);
    updated.forEach((r, i) => (r.rowid = i + 1));
    setRows(updated);
  };

  const isFormValid = () =>
    rows.every((r) => r.ID_ItemType && r.Approx_Gross_Weight);

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
    await addItemType(type, payload, selectedDesignId);

    // ✅ Reset form
    setShowAddForm(false);
    setRows([
      {
        rowid: 1,
        ID_ItemType: "",
        Approx_Gross_Weight: "",
        ID_Header: selectedDesignId,
      },
    ]);
    fetchDesignItemType(type, selectedDesignId);
  };
  // 🎯 Toast notifications
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Item Type Detail updated successfully!");
      clearUpdateState();
      fetchDesignItemType(type, selectedDesignId);
      setParams({ IsAction: false, ActionID: -1 });
    } else if (updateError) {
      toast.error(updateError);
      clearUpdateState();
    }
  }, [updateIsSuccess, updateError]);

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Item Type deleted successfully!");
      clearDeleteState();
      fetchDesignItemType(type, selectedDesignId);
    } else if (deleteError) {
      toast.error(deleteError);
      clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError]);

  useEffect(() => {
    if (addIsSuccess) {
      toast.success("New detail added!");
      clearAddState();
      fetchDesignItemType(type, selectedDesignId);
    } else if (addError) {
      toast.error(addError);
      clearAddState();
    }
  }, [addIsSuccess, addError]);

  // 🧱 Columns
  const Col = [
    {
      headername: "Item Type",
      fieldname: "ItemType_Name",
      selectionname: "ID_ItemType",
      isSelection: true,
      options: itemTypeOptions,
      width: "250px",
    },
    {
      headername: "Approx Gross Weight",
      fieldname: "Approx_Gross_Weight",
      type: "number",
      width: "150px",
    },
  ];

  const detailColumns = [
    {
      label: "Item Type",
      key: "ID_ItemType",
      AutoSearch: true,
      data: itemTypeOptions,
      width: "200px",
      PlaceHolder: "Select Item Type",
    },
    {
      label: "Approx Gross Weight",
      key: "Approx_Gross_Weight",
      type: "number",
      width: "150px",
      PlaceHolder: "Enter Weight",
    },
  ];

  return (
    <div className="table-box">
      <Table2
        tab={DesignItemType}
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
            <h5>Add New Design Item Types</h5>
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

export default DesignItemTypeTable;
