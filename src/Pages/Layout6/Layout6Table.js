import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout6Master from "../../Store/MasterStore/useLayout6Master";
import useLayout11Master from "../../Store/MasterStore/useLayout11Master";

function Layout6Table({ setIsDisable, search, setTextDetail, type }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  // keep editedData aligned with RawMaterialMaster
  const [editedData, setEditedData] = useState({
    Raw_ID: null,
    Raw_Code: "",
    Raw_Description: "",
    Tolerance_Lower: "",
    Tolerance_Upper: "",
    Metal_Type: "",
  });
        const metalOptions = {
          P: "Pure",
          B: "Brass",
          A: "Alloy",
          M: "Model",
          S: "Scrap",
          O: "Others",
        };

  // Fetch SystemMaster for dropdown
  const { layout11 } = useLayout11Master();

  const systemDropdown = useMemo(() => {
    return layout11?.map((item) => ({
      label: metalOptions[item.Metal_Type],
      value: item.id,
    }));
  }, [layout11]);

  const {
    layout6,
    fetchLayout6,
    fetchIsLoading,
    addIsSuccess,
    updateLayout6,
    updateIsSuccess,
    updateError,
    clearUpdateState,
    deleteLayout6,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useLayout6Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        Raw_ID: selected.Raw_ID,
        Raw_Code: selected.Raw_Code,
        Raw_Description: selected.Raw_Description,
        Tolerance_Lower: selected.Tolerance_Lower,
        Tolerance_Upper: selected.Tolerance_Upper,
        Metal_Type: selected.Metal_Type,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { Raw_ID, Raw_Code, Raw_Description, Metal_Type } = editedData;

    if (!Raw_Code || !Raw_Description || !Metal_Type) {
      toast.error("All mandatory fields are required");
      return;
    }

    updateLayout6(type, Raw_ID, editedData);
  };

  // Delete
  const handleDelete = (rowIndex) => {
    const obj = filteredData[rowIndex];
    if (obj) deleteLayout6(type, obj.Raw_ID);
  };

  // Search filter
  useEffect(() => {
    const val = search?.toLowerCase();
    const filtered = layout6.filter(
      (c) =>
        c.Raw_Code?.toLowerCase().includes(val) ||
        c.Raw_Description?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, layout6]);

  // Fetch list
  useEffect(() => {
    fetchLayout6(type);
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Raw Material Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Raw_ID: null,
        Raw_Code: "",
        Raw_Description: "",
        Tolerance_Lower: "",
        Tolerance_Upper: "",
        Metal_Type: "",
      });
      setIsDisable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // Handle delete
  useEffect(() => {
    if (deleteIsSuccess) toast.success("Deleted Successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  // Table Columns
  const Col = [
    {
      headername: "Raw Code",
      fieldname: "Raw_Code",
      type: "String",
      width: "100px",
    },
    {
      headername: "Raw Description",
      fieldname: "Raw_Description",
      type: "String",
      width: "150px",
    },
    {
      headername: "Tolerance Lower",
      fieldname: "Tolerance_Lower",
      type: "Decimal",
      width: "120px",
    },
    {
      headername: "Tolerance Upper",
      fieldname: "Tolerance_Upper",
      type: "Decimal",
      width: "120px",
    },
    {
      headername: "System",
      fieldname: "Metal_Type_Label",
      selectionname: "Metal_Type",
      type: "String",
      isSelection: true,
      options: systemDropdown,
    },
  ];

  return (
    <div className="table-box">
      <Table
        tab={filteredData || []}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={(i, e) =>
          setEditedData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
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

export default Layout6Table;
