import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useUnitMaster from "../../Store/MasterStore/useUnitMaster";

function UnitTable({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);

  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: null,
    Unit_Code: "",
    Description: "",
    Conversion: "",
  });

  const {
    units,
    fetchUnits,
    fetchIsLoading,

    updateUnit,
    updateIsSuccess,
    updateError,
    clearUpdateState,

    deleteUnit,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useUnitMaster();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) {
      setEditedData({
        ID: selected.Unit_ID,
        Unit_Code: selected.Unit_Code,
        Description: selected.Description,
        Conversion: selected.Conversion,
      });
    }
  };

  // Save changes
  const SaveChange = () => {
    const { Unit_Code, Description, Conversion } = editedData;
    if (!Unit_Code || !Description || !Conversion) {
      toast.error("All fields are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Unit_Code)) {
      toast.error("Code must be alphanumeric & max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description must be alphanumeric & max 15 chars");
      return;
    }
    const conv = parseFloat(Conversion);
    if (isNaN(conv)) {
      toast.error("Conversion must be a valid number");
      return;
    }

    updateUnit(editedData.ID, {
      Unit_Code,
      Description,
      Conversion,
    });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) {
      deleteUnit(obj.Unit_ID);
    }
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = units.filter(
      (u) =>
        u.Unit_ID?.toString().includes(val) ||
        u.Unit_Code?.toLowerCase().includes(val) ||
        u.Description?.toLowerCase().includes(val) ||
        u.Conversion?.toString().includes(val)
    );
    setFilteredData(filtered);
  }, [search, units]);

  // Fetch list on mount
  useEffect(() => {
    fetchUnits();
  }, []);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Unit Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        ID: null,
        Unit_Code: "",
        Description: "",
        Conversion: "",
      });
      setIsDisable(false);
      fetchUnits();
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Unit Deleted Successfully");
      fetchUnits();
    }
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  const Col = [
    {
      headername: "Code",
      fieldname: "Unit_Code",
      type: "String",
      width: "120px",
    },
    { headername: "Description", fieldname: "Description", type: "String" },
    {
      headername: "Conversion",
      fieldname: "Conversion",
      type: "Decimal",
      width: "100px",
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={filteredData || []}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={(i, e) => {
          if (e.target.name === "Conversion" && e.target.value !== "") {
            // Allow only numbers and a single decimal point also before . it can take 7 numbers and after . it can take 3 digits
            const regex = /^\d{1,7}\.?\d{0,3}$/;
            if (!regex.test(e.target.value)) {
              return;
            }
          }
          setEditedData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }
        }
        OnSaveHandler={SaveChange}
        getFocusText={(val) => setTextDetail(val)}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={fetchIsLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        height={"40vh"}
      />
    </div>
  );
}

export default UnitTable;
