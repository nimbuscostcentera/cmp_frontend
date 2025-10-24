import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Table from "../../../Components/Table";
import ReusableModal from "../../../Components/ReusableModal";
import Tab4StoneTable from "./Tab4StoneTable";
import Tab4ColorTable from "./Tab4ColorTable";
import useTab4Master from "../../../Store/OpeningStore/useTab4Master";
import useDesignItemType from "../../../Store/MasterStore/useDesignItemType";

function Tab4MasterTable({
  setIsDisable,
  search,
  setTextDetail,
  sizeOptions,
  stoneMainOptions,
  stoneSubOptions,
  colorOptions,
  departmentOptions,
  designOptions,
  itemOptions,
}) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [showStoneModal, setShowStoneModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedTab4Id, setSelectedTab4Id] = useState(null);

  const [editedData, setEditedData] = useState({
    ID: null,
    ID_Department: null,
    ID_Department_Code: "",
    ID_Design: null,
    ID_Design_Code: "",
    ID_ItemType: null,
    ID_ItemType_Code: "",
    ID_Item: null,
    ID_Item_Code: "",
    ID_Size: null,
    ID_Size_Code: "",
    Trancode: "OPE",
    Srl: 0,
    Pcs: 0,
    GWeight: 0,
    ColorS: "",
  });

  const {
    tab4Data,
    fetchTab4,
    updateTab4,
    deleteTab4,
    addIsSuccess,
    updateIsSuccess, 
    deleteIsSuccess,
    updateError,
    deleteError,
    clearUpdateState,
    clearDeleteState,
  } = useTab4Master();

  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
  };


    const { DesignItemType, fetchDesignItemType } = useDesignItemType();

  // Fetch item types whenever design changes
  useEffect(() => {
    if (editedData.ID_Design) {
      fetchDesignItemType("itemtype", editedData.ID_Design);
    }
  }, [editedData.ID_Design]);

  const itemtypeOptions = DesignItemType.map((i) => ({
    label: `${i.ItemType_Name}:${i.Approx_Gross_Weight}`,
    value: i.ID_ItemType,
    Approx_Gross_Weight: i.Approx_Gross_Weight,
  }));


  // Auto-calculate GWeight when ItemType or Pcs changes
  useEffect(() => {
    const selectedItemType = itemtypeOptions.find(
      (item) => item.value === editedData.ID_ItemType
    );

    const weightPerPiece =
      parseFloat(selectedItemType?.Approx_Gross_Weight) || 0;
    const pcs = parseFloat(editedData.Pcs) || 0;

    const gWeight = weightPerPiece * pcs;

    setEditedData((prev) => ({
      ...prev,
      GWeight: gWeight > 0 ? gWeight.toFixed(3).toString() : "",
    }));
  }, [editedData.ID_ItemType, editedData.Pcs]);


  const SaveChange = () => {
    const {
      ID_Department,
      ID_Design,
      ID_ItemType,
      ID_Item,
      ID_Size,
      Pcs,
      GWeight,
      ColorS,
    } = editedData;

    if (!ID_Department) return toast.error("Department is required");
    if (!ID_Design) return toast.error("Design is required");
    if (!ID_ItemType) return toast.error("Item Type is required");
    if (!ID_Item) return toast.error("Item is required");
    if (!ID_Size) return toast.error("Size is required");
    if (isNaN(GWeight)) return toast.error("Gross Weight must be a number");

  

    updateTab4("design_header", editedData.ID, editedData);
  };

  const handleDelete = (index) => {
    const row = filteredData[index];
    if (row) deleteTab4("design_header",row.ID);
  };

  const handleStoneClick = (index) => {
    const row = filteredData[index];
    if (row) {
      setSelectedTab4Id(row.ID);
      setShowStoneModal(true);
    }
  };

  const handleColorClick = (index) => {
    const row = filteredData[index];
    if (row) {
      setSelectedTab4Id(row.ID);
      setShowColorModal(true);
    }
  };

  const handleCloseStone = () => {
    setShowStoneModal(false);
    setSelectedTab4Id(null);
  };

  const handleCloseColor = () => {
    setShowColorModal(false);
    setSelectedTab4Id(null);
  };

useEffect(() => {
  const val = search?.toLowerCase();

  // Step 1: Filter as before
  const filtered = tab4Data.filter(
    (r) =>
      r.ID_Department_Code?.toLowerCase().includes(val) ||
      r.ID_Design_Code?.toLowerCase().includes(val) ||
      r.ID_Item_Code?.toLowerCase().includes(val) ||
      r.ID_ItemType_Code?.toLowerCase().includes(val) ||
      r.ID_Size_Code?.toLowerCase().includes(val)
  );

  // Step 2: Create a display label for ColorS
  const updatedFiltered = filtered.map((row) => {
    let colorLabel = "";

    if (row.ColorS) {
      const colorIds = row.ColorS.split(",").map((id) => id.trim());
      const colorLabels = colorIds
        .map((id) => {
          const match = colorOptions.find(
            (c) => String(c.value) === String(id)
          );
          return match ? match.label : id;
        })
        .join(", ");
      colorLabel = colorLabels;
    }

    // Add a new field only for display
    return { ...row, ColorS_Label: colorLabel };
  });

  setFilteredData(updatedFiltered);
}, [search, tab4Data, colorOptions]);



  useEffect(() => {
    fetchTab4("design_header");
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

useEffect(() => {
  if (updateIsSuccess) {
    toast.success("Updated successfully");

    // ✅ Reset edited data after successful update
    setEditedData({
      ID: null,
      ID_Department: null,
      ID_Department_Code: "",
      ID_Design: null,
      ID_Design_Code: "",
      ID_ItemType: null,
      ID_ItemType_Code: "",
      ID_Item: null,
      ID_Item_Code: "",
      ID_Size: null,
      ID_Size_Code: "",
      Trancode: "OPE",
      Srl: 0,
      Pcs: 0,
      GWeight: 0,
      ColorS: "",
    });

    // ✅ Reset action params and disable edit mode
    setParams({ IsAction: false, ActionID: -1 });
    setIsDisable(false);
  }

  if (updateError) toast.error(updateError);

  // ✅ Always clear state in the end
  clearUpdateState();
}, [updateIsSuccess, updateError]);


  useEffect(() => {
    if (deleteIsSuccess) toast.success("Deleted successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  const Col = [
    {
      headername: "Department",
      fieldname: "ID_Department_Code",
      selectionname: "ID_Department",
      type: "String",
      isSelection: true,
      options: departmentOptions,
      width: "200px",
    },
    {
      headername: "Design",
      fieldname: "ID_Design_Code",
      selectionname: "ID_Design",
      type: "String",
      isSelection: true,
      options: designOptions,
      width: "200px",
    },
    {
      headername: "Item Type",
      fieldname: "ID_ItemType_Code",
      selectionname: "ID_ItemType",
      type: "String",
      isSelection: true,
      options: itemtypeOptions,
      width: "200px",
    },
    {
      headername: "Item",
      fieldname: "ID_Item_Code",
      selectionname: "ID_Item",
      type: "String",
      isSelection: true,
      options: itemOptions,
      width: "200px",
    },
    {
      headername: "Size",
      fieldname: "ID_Size_Code",
      selectionname: "ID_Size",
      type: "String",
      isSelection: true,
      options: sizeOptions,
      width: "200px",
    },
    {
      headername: "Pcs",
      fieldname: "Pcs",
      type: "number",
      width: "120px",
    },
    {
      headername: "Gross Weight",
      fieldname: "GWeight",
      type: "number",
      width: "120px",
      isReadOnly: true,
    },
    {
      headername: "ColorS",
      fieldname: "ColorS_Label", // 👈 shows the label version
      type: "text",
      width: "150px",
      isReadOnly: true,
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
          const name = e.target.name;
          let val = e.target.value;
          if (name === "GWeight") val = parseFloat(val) || 0;
          setEditedData((prev) => ({ ...prev, [name]: val }));
        }}
        OnSaveHandler={SaveChange}
        // getFocusText={(val) => setTextDetail(val)}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isDelete={true}
        handleDelete={handleDelete}
        height={"55vh"}
        isView={true}
        isView1={true}
        handleViewClick={handleStoneClick}
        handleViewClick1={handleColorClick}
        viewPref={"St."}
        viewPref1={"Col."}
      />

      <ReusableModal
        show={showStoneModal}
        handleClose={handleCloseStone}
        Title={`Stones for ID #${selectedTab4Id || ""}`}
        body={
          <Tab4StoneTable
            show={showStoneModal}
            handleClose={handleCloseStone}
            sizeOptions={sizeOptions}
            stoneMainOptions={stoneMainOptions}
            stoneSubOptions={stoneSubOptions}
            colorOptions={colorOptions}
            selectedDesignId={selectedTab4Id}
          />
        }
        PrimaryButtonName="Close"
        isPrimary
        handlePrimary={handleCloseStone}
      />

      <ReusableModal
        show={showColorModal}
        handleClose={handleCloseColor}
        Title={`Colors for ID #${selectedTab4Id || ""}`}
        body={
          <Tab4ColorTable
            show={showColorModal}
            handleClose={handleCloseColor}
            colorOptions={colorOptions}
            selectedDesignId={selectedTab4Id}
          />
        }
        PrimaryButtonName="Close"
        isPrimary
        handlePrimary={handleCloseColor}
      />
    </div>
  );
}

export default Tab4MasterTable;
