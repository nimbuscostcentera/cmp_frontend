import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Table from "../../../Components/Table";
import ReusableModal from "../../../Components/ReusableModal";
import Tab4Stone from "./Tab4Stone";
import Tab4Color from "./Tab4Color";
// ✅ Zustand store
import useTab4Master from "../../../Store/OpeningStore/useTab4Master";

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
  itemtypeOptions,
}) {
  const editinputref = useRef(null);

  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [showStoneModal, setShowStoneModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedTab4Id, setSelectedTab4Id] = useState(null);

  const [editedData, setEditedData] = useState({
    ID: null,
    Code: "",
    Description: "",
    Department: "",
    Design: "",
    Item: "",
    ItemType: "",
    GrossWeight: 0,
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

  // ✅ Edit
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
  };

  // ✅ Save Change
  const SaveChange = () => {
    const { Code, Description, GrossWeight } = editedData;

    if (!Code) return toast.error("Code is required");
    if (!Description) return toast.error("Description is required");
    if (isNaN(GrossWeight)) return toast.error("Weight must be a number");

    const formData = new FormData();
    Object.keys(editedData).forEach((key) =>
      formData.append(key, editedData[key])
    );

    updateTab4(editedData.ID, formData);
  };

  // ✅ Delete
  const handleDelete = (index) => {
    const row = filteredData[index];
    if (row) deleteTab4(row.ID);
  };

  // ✅ Open modals
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

  // ✅ Search filter
  useEffect(() => {
    const val = search?.toLowerCase();
    const filtered = tab4Data.filter(
      (r) =>
        r.Code?.toLowerCase().includes(val) ||
        r.Description?.toLowerCase().includes(val) ||
        r.Department?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, tab4Data]);

  // ✅ Fetch data
  useEffect(() => {
    fetchTab4();
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // ✅ Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) toast.success("Updated successfully");
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // ✅ Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess) toast.success("Deleted successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  // ✅ Table Columns
  const Col = [
    { headername: "Code", fieldname: "Code", type: "text", width: "150px" },
    {
      headername: "Description",
      fieldname: "Description",
      type: "text",
      width: "150px",
    },
    {
      headername: "Department",
      fieldname: "department_name",
      selectionname: "Department",
      isSelection: true,
      options: departmentOptions,
      width: "150px",
    },
    {
      headername: "Design",
      fieldname: "design_name",
      selectionname: "Design",
      isSelection: true,
      options: designOptions,
      width: "150px",
    },
    {
      headername: "Item",
      fieldname: "item_name",
      selectionname: "Item",
      isSelection: true,
      options: itemOptions,
      width: "150px",
    },
    {
      headername: "Item Type",
      fieldname: "itemtype_name",
      selectionname: "ItemType",
      isSelection: true,
      options: itemtypeOptions,
      width: "150px",
    },
    {
      headername: "Gross Weight",
      fieldname: "GrossWeight",
      type: "number",
      width: "120px",
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
          if (name === "GrossWeight") val = parseFloat(val) || 0;
          setEditedData((prev) => ({ ...prev, [name]: val }));
        }}
        OnSaveHandler={SaveChange}
        getFocusText={(val) => setTextDetail(val)}
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

      {/* Stone Modal */}
      <ReusableModal
        show={showStoneModal}
        handleClose={handleCloseStone}
        Title={`Stones for ID #${selectedTab4Id || ""}`}
        body={
          <Tab4Stone
            show={showStoneModal}
            handleClose={handleCloseStone}
            rows={[]}
            setRows={() => {}}
            sizeOptions={sizeOptions}
            stoneMainOptions={stoneMainOptions}
            stoneSubOptions={stoneSubOptions}
            colorOptions={colorOptions}
          />
        }
        PrimaryButtonName="Close"
        isPrimary
        handlePrimary={handleCloseStone}
      />

      {/* Color Modal */}
      <ReusableModal
        show={showColorModal}
        handleClose={handleCloseColor}
        Title={`Colors for ID #${selectedTab4Id || ""}`}
        body={
          <Tab4Color
            show={showColorModal}
            handleClose={handleCloseColor}
            rows={[]}
            setRows={() => {}}
            colorOptions={colorOptions}
            Color_Display={true}
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
 