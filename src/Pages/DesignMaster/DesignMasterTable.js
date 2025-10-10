import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useDesignMaster from "../../Store/MasterStore/useDesignMaster";
import ReusableModal from "../../Components/ReusableModal";
import DesignDetailTable from "./DesignDetailTable";
import DesignItemTypeTable from "./DesignItemTypeTable";

function DesignMasterTable({
  setIsDisable,
  search,
  setTextDetail,
  type,
  dropdowndgm, // master
  dropdownitem, // master
  sizeOptions, //detail
  stoneSOptions, //detail
  stoneMOptions, //detail
  dropdownitm, //itemtype
}) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  console.log(dropdowndgm, dropdownitem);
  // For modal
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);

  const [editedData, setEditedData] = useState({
    DesignID: null, // ✅ changed from ID
    Design_Code: "",
    Design_Description: "",
    Design_Group: "",
    ID_master: "",
    Picture: "",
    Gross_Weight: 0,
    Tolerance_Lower: 0,
    Tolerance_Upper: 0,
  });

  const {
    Design,
    fetchDesign,
    fetchIsLoading,
    addIsSuccess,
    updateDesign,
    updateIsSuccess,
    updateError,
    clearUpdateState,
    deleteDesign,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useDesignMaster();

  // ✅ Handle Edit action
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
  };

  // ✅ Save Edited Row
  const SaveChange = () => {
    const { DesignID, Design_Description, Design_Code, Pcs, Gross_Weight } =
      editedData;

    if (!DesignID) {
      toast.error("Design Code is required");
      return;
    }
    if (!Design_Code) {
      toast.error("Design Code is required");
      return;
    }

    if (!Design_Description) {
      toast.error("Design Description is required");
      return;
    }
    if (!Gross_Weight || isNaN(Gross_Weight)) {
      toast.error("Weight must be a valid number");
      return;
    }
    console.log(editedData?.Tolerance_Lower, editedData?.Tolerance_Upper);
    if (
      editedData?.Tolerance_Lower !== "" &&
      editedData?.Tolerance_Upper !== "" &&
      editedData?.Tolerance_Lower !== null &&
      editedData?.Tolerance_Upper !== null
    ) {
      if (editedData?.Tolerance_Lower >= editedData?.Tolerance_Upper) {
        toast.error(
          "Tolerance Lower cannot be greater than or equal to Tolerance Upper"
        );
        return;
      }
      if (editedData?.Tolerance_Lower < 0 || editedData?.Tolerance_Upper < 0) {
        toast.error("Tolerance values cannot be negative");
        return;
      }
    } else {
      editedData.Tolerance_Lower = "";
      editedData.Tolerance_Upper = "";
    }

    const formData = new FormData();

    for (const key in editedData) {
      if (key === "Picture") {
        // ✅ Only append if it’s a real file
        if (editedData.Picture instanceof File) {
          formData.append("Picture", editedData.Picture);
        }
      } else {
        formData.append(key, editedData[key]);
      }
    }
    updateDesign(type, DesignID, formData); // ✅ use DesignID
  };
  // console.log(editedData, "editedData");
  const PictureHandler = (index, e) => {
    let value = e.target.files[0];
    setEditedData((prev) => ({ ...prev, Picture: value }));
  };
  // ✅ Delete Row
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteDesign(type, obj.DesignID); // ✅ use DesignID
  };

  // ✅ View Details (modal placeholder)
  const handleViewClick = (index) => {
    const selected = filteredData[index];
    if (selected) {
      setSelectedDesignId(selected.DesignID); // ✅ use DesignID
      setShowModal(true);
    }
  };
  const handleViewClick1 = (index) => {
    const selected = filteredData[index];
    if (selected) {
      setSelectedDesignId(selected.DesignID); // ✅ use DesignID
      setShowModal1(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDesignId(null);
  };
  const handleCloseModal1 = () => {
    setShowModal1(false);
    setSelectedDesignId(null);
  };

  // ✅ Filter data based on search
  useEffect(() => {
    const val = search?.toLowerCase();
    const filtered = Design.filter(
      (c) =>
        c.Design_Code?.toLowerCase().includes(val) ||
        c.Design_Description?.toLowerCase().includes(val) ||
        c.Pcs?.toString().includes(val) ||
        c.Weight?.toString().includes(val)
    );
    setFilteredData(filtered);
  }, [search, Design]);

  // ✅ Fetch data on mount or after add/update/delete
  useEffect(() => {
    fetchDesign(type);
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess, type]);

  // ✅ Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("DesignMaster Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        DesignID: null,
        Design_Code: "",
        Design_Description: "",
        Design_Group: "",
        ID_master: "",
        Pcs: 1,
        Weight: 0,
        Picture: "",
        Gross_Weight: 0,
        Tolerance_Lower: 0,
        Tolerance_Upper: 0,
      });
      setIsDisable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // ✅ Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess) toast.success("Deleted Successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  // ✅ Table columns
  const Col = [
    {
      headername: "Design Code",
      fieldname: "Design_Code",
      type: "text",
      width: "150px",
      isUseInputRef: true,
    },
    {
      headername: "Description",
      fieldname: "Design_Description",
      type: "text",
      width: "200px",
    },
    {
      headername: "Design Group",
      fieldname: "dgm_name",
      selectionname: "Design_Group",
      isSelection: true,
      options: dropdowndgm,
      width: "250px",
    },
    {
      headername: "Item",
      fieldname: "item_name",
      selectionname: "ID_master",
      isSelection: true,
      options: dropdownitem,
      width: "250px",
    },
    {
      headername: "Picture",
      fieldname: "Picture",
      type: "Img",
      max: 100,
      isShortingOff: true,
      isNotEditable: true,
    },
    {
      headername: "Gross Weight",
      fieldname: "Gross_Weight",
      type: "number",
      width: "120px",
    },
    {
      headername: "Tolerance Lower",
      fieldname: "Tolerance_Lower",
      type: "number",
      width: "120px",
    },
    {
      headername: "Tolerance Upper",
      fieldname: "Tolerance_Upper",
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
          const colKey = e.target.name;
          let newValue = e.target.value;
          // Parse numeric fields
          if (
            [
              "Pcs",
              "Weight",
              "Gross_Weight",
              "Tolerance_Lower",
              "Tolerance_Upper",
            ].includes(colKey)
          ) {
            newValue = parseFloat(newValue) || 0;
          }

          if (colKey === "Tolerance_Lower" || colKey === "Tolerance_Upper") {
            const regex = /^\d{0,7}(\.\d{0,3})?$/;
            if (newValue !== "" && !regex.test(newValue)) return;
          }
          if (colKey === "Gross_Weight") {
            const regex = /^\d{0,6}(\.\d{0,3})?$/;
            if (newValue !== "" && !regex.test(newValue)) return;
          }

          setEditedData((prev) => ({ ...prev, [colKey]: newValue }));
        }}
        OnSaveHandler={SaveChange}
        getFocusText={(val) => setTextDetail(val)}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={fetchIsLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        height={"50vh"}
        isView={true}
        isView1={true}
        handleViewClick={handleViewClick}
        handleViewClick1={handleViewClick1}
        PictureHandler={PictureHandler}
        viewPref={"St."}
        viewPref1={"It."}
      />

      {/* Placeholder for modal, uncomment if needed */}
      {/* --- Layout10 Modal --- */}
      <ReusableModal
        show={showModal}
        handleClose={handleCloseModal}
        Title={`Details for Design #${selectedDesignId || ""}`}
        body={
          <DesignDetailTable
            selectedDesignId={selectedDesignId}
            closeModal={handleCloseModal}
            type={"detail"}
            // dropdownListMiscCharge={dropdownListMiscCharge}
            stoneSOptions={stoneSOptions}
            stoneMOptions={stoneMOptions}
            sizeOptions={sizeOptions}
          />
        }
        PrimaryButtonName="Close"
        isPrimary={true}
        handlePrimary={handleCloseModal}
      />

      <ReusableModal
        show={showModal1}
        handleClose={handleCloseModal1}
        Title={`Item Type for Design #${selectedDesignId || ""}`}
        body={
          <DesignItemTypeTable
            selectedDesignId={selectedDesignId}
            closeModal={handleCloseModal1}
            type={"itemtype"}
            // dropdownListMiscCharge={dropdownListMiscCharge}
            itemTypeOptions={dropdownitm}
          />
        }
        PrimaryButtonName="Close"
        isPrimary={true}
        handlePrimary={handleCloseModal1}
      />
    </div>
  );
}

export default DesignMasterTable;
