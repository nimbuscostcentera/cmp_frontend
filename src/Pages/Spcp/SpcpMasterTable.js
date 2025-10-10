import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useSpcpMaster from "../../Store/MasterStore/useSpcpMaster";
import ReusableModal from "../../Components/ReusableModal";
import SpcpDetailTable from "./SpcpDetailTable";

function SpcpMasterTable({
  setIsDisable,
  search,
  setTextDetail,
  type,
  dropdownListStoneM,
  dropdownListStoneS,
  dropdownListColor,
  dropdownListMiscCharge,
}) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  // For modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSpcpId, setSelectedSpcpId] = useState(null);
  const [headerCp, setHeaderCp] = useState(null);

  const [editedData, setEditedData] = useState({
    type: "header",
    ID: null,
    ID_StoneM: "",
    Srl_Col: "",
    ID_StoneS: "",
    ID_Color: "",
    Pcs: "",
    Weight: "",
    CP: "",
    SP: "",
  });

  const {
    Spcp,
    fetchSpcp,
    fetchIsLoading,
    addIsSuccess,
    updateSpcp,
    updateIsSuccess,
    updateError,
    clearUpdateState,
    deleteSpcp,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useSpcpMaster();

  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) setEditedData({ ...selected });
  };

  const SaveChange = () => {
    const { ID, ID_StoneM, Srl_Col, ID_StoneS, ID_Color, Pcs, Weight, CP, SP } =
      editedData;

    if (!ID_StoneM || !ID_StoneS || !ID_Color) {
      toast.error("Stone Master, Sub Master and Color are required");
      return;
    }

    if (!Pcs || isNaN(Pcs)) {
      toast.error("Pcs must be a number");
      return;
    }
    if (!Weight || isNaN(Weight)) {
      toast.error("Weight must be a valid number");
      return;
    }

    updateSpcp(type, ID, editedData);
  };

  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteSpcp(type, obj.ID);
  };

  // --- handle View button ---
  const handleViewClick = (index) => {
    const selected = filteredData[index];
    if (selected) {
      setSelectedSpcpId(selected.ID);
      setHeaderCp(selected.CP);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSpcpId(null);
  };

  useEffect(() => {
    const val = search?.toLowerCase();
    const filtered = Spcp.filter(
      (c) =>
        c.StoneM_Name?.toString().toLowerCase().includes(val) ||
        c.StoneS_Name?.toString().toLowerCase().includes(val) ||
        c.Color_Name?.toString().toLowerCase().includes(val) ||
        c.Srl_Col?.toString().includes(val) ||
        c.Pcs?.toString().includes(val) ||
        c.Weight?.toString().includes(val) ||
        c.CP?.toString().includes(val) ||
        c.SP?.toString().includes(val)
    );
    setFilteredData(filtered);
  }, [search, Spcp]);

  useEffect(() => {
    fetchSpcp(type);
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess, type]);

  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("SPCP Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        type: "header",
        ID: null,
        ID_StoneM: "",
        Srl_Col: "",
        ID_StoneS: "",
        ID_Color: "",
        Pcs: "",
        Weight: "",
        CP: "",
        SP: "",
      });
      setIsDisable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  useEffect(() => {
    if (deleteIsSuccess) toast.success("Deleted Successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  const Col = [
    {
      headername: "Stone M.",
      fieldname: "StoneM_Name",
      selectionname: "ID_StoneM",
      type: "number",
      width: "200px",
      isSelection: true,
      options: dropdownListStoneM,
      
    },
  
    {
      headername: "Stone Sub Master",
      fieldname: "StoneS_Name",
      type: "Number",
      width: "200px",
      isSelection: true,
      selectionname: "ID_StoneS",
      options: dropdownListStoneS,
    },
    {
      headername: "Color",
      fieldname: "Color_Name",
      isSelection: true,
      selectionname: "ID_Color",
      options: dropdownListColor,
      type: "number",
      width: "200px",
    },
    { headername: "Pcs", fieldname: "Pcs", type: "number", width: "100px" },
    {
      headername: "Weight",
      fieldname: "Weight",
      type: "number",
      width: "120px",
      isReadOnly: true,
    },
    { headername: "CP", fieldname: "CP", type: "number", width: "120px" },
    {
      headername: "SP",
      fieldname: "SP",
      type: "number",
      width: "120px",
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
          const colKey = e.target.name;
          const newValue = e.target.value;
          let weightchange;

          setEditedData((prev) => {
            let updated = { ...prev, [colKey]: newValue };

            if (colKey === "ID_StoneS") {
              weightchange =
                dropdownListStoneS.find(
                  (item) => item.value == parseInt(e.target.value)
                )?.Standard_Weight || 0;
              updated.Weight = weightchange;
            }

            if (colKey === "CP") {
              const prevCP = parseFloat(prev.CP || 0);
              const prevSP = parseFloat(prev.SP || 0);
              const newCP = parseFloat(newValue || 0);
              const newSP = prevSP - prevCP + newCP;
              updated.SP = newSP.toFixed(2);
            }

            return updated;
          });
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
        height={"45vh"}
        isView={true}
        handleViewClick={handleViewClick}
        viewPref={"St."}
      />

      {/* --- Layout10 Modal --- */}
      <ReusableModal
        show={showModal}
        handleClose={handleCloseModal}
        Title={`Details for SPCP #${selectedSpcpId || ""}`}
        body={
          <SpcpDetailTable
            selectedSpcpId={selectedSpcpId}
            closeModal={handleCloseModal}
            type={"detail"}
            dropdownListMiscCharge={dropdownListMiscCharge}
            headerCP={headerCp}
          />
        }
        PrimaryButtonName="Close"
        isPrimary={true}
        handlePrimary={handleCloseModal}
      />
    </div>
  );
}

export default SpcpMasterTable;
