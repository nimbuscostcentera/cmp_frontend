import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useFetchColorMaster from "../../Store/ShowStore/useFetchColorMaster";
import useEditColorMaster from "../../Store/UpdateStore/useEditColorMaster";
import useDeleteColorMaster from "../../Store/DeleteMasterStore/useDeleteColorMaster";
import useAddColorMaster from "../../Store/AddStore/useAddColorMaster";

function UnitTable({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: null,
    CODE: "",
    DESCRIPTION: "",
    RATE: "",
  });

  const [CompanyID, setCompanyID] = useState(1);
  const { ColorMasterList, fetchColorMaster, isColorMasterLoading } =
    useFetchColorMaster();
  const {
    EditColorMasterFunc,
    ColorMasterEditSuccess,
    ColorMasterEditError,
    ClearStateEditColorMaster,
  } = useEditColorMaster();
  const {
    DeleteColorMaster,
    ColorMasterDeleteMsg,
    ColorMasterDeleteErr,
    ClearColorMasterDelete,
  } = useDeleteColorMaster();
  const { ColorMasterSuccess } = useAddColorMaster();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        ID: selected.ID,
        CODE: selected.CODE,
        DESCRIPTION: selected.DESCRIPTION,
        RATE: selected.RATE,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { CODE, DESCRIPTION, RATE } = editedData;
    if (!CODE || !DESCRIPTION || !RATE) {
      toast.error("All fields are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(CODE)) {
      toast.error("Code must be alphanumeric & max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(DESCRIPTION)) {
      toast.error("Description must be alphanumeric & max 15 chars");
      return;
    }
    const rateValue = parseFloat(RATE);
    if (isNaN(rateValue) || rateValue >= 5.2) {
      toast.error("Rate/Gm must be a decimal value less than 5.2");
      return;
    }

    EditColorMasterFunc({ ...editedData, CompanyID });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) DeleteColorMaster({ CompanyID, ID: obj.ID });
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = ColorMasterList.filter(
      (c) =>
        c.CODE?.toLowerCase().includes(val) ||
        c.DESCRIPTION?.toLowerCase().includes(val) ||
        c.RATE?.toString().includes(val)
    );
    setFilteredData(filtered);
  }, [search, ColorMasterList]);

  // Fetch list
  useEffect(() => {
    fetchColorMaster({ CompanyID });
  }, [ColorMasterSuccess]);

  // Handle edit success/error
  useEffect(() => {
    if (ColorMasterEditSuccess) {
      toast.success("Plating/Polish Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({ ID: null, CODE: "", DESCRIPTION: "", RATE: "" });
      setIsDisable(false);
    }
    if (ColorMasterEditError) toast.error(ColorMasterEditError);
    ClearStateEditColorMaster();
  }, [ColorMasterEditSuccess, ColorMasterEditError]);

  // Handle delete
  useEffect(() => {
    if (ColorMasterDeleteMsg) toast.success(ColorMasterDeleteMsg);
    if (ColorMasterDeleteErr) toast.error(ColorMasterDeleteErr);
    ClearColorMasterDelete();
  }, [ColorMasterDeleteMsg, ColorMasterDeleteErr]);

  const Col = [
    { headername: "Code", fieldname: "CODE", type: "String", width: "120px" },
    { headername: "Description", fieldname: "DESCRIPTION", type: "String" },
    {
      headername: "Rate/Gm",
      fieldname: "RATE",
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
        OnChangeHandler={(i, e) =>
          setEditedData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        OnSaveHandler={SaveChange}
        getFocusText={(val) => {
          setTextDetail(val);
        }}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={isColorMasterLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        height={"40vh"}
      />
    </div>
  );
}

export default UnitTable;
