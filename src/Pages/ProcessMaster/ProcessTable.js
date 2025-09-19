import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";

import useFetchColorMaster from "../../Store/ShowStore/useFetchColorMaster";
import useEditColorMaster from "../../Store/UpdateStore/useEditColorMaster";
import useDeleteColorMaster from "../../Store/DeleteMasterStore/useDeleteColorMaster";
import useAddColorMaster from "../../Store/AddStore/useAddColorMaster";

function ProcessTable({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: null,
    CODE: "",
    DESCRIPTION: "",
    PROCESS_SERIAL: "",
    EXECUTION_DAYS: "",
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
        PROCESS_SERIAL: selected.PROCESS_SERIAL,
        EXECUTION_DAYS: selected.EXECUTION_DAYS,
      });
  };


  // Save changes
  const SaveChange = () => {
    const { CODE, DESCRIPTION } = editedData;
    if (!CODE || !DESCRIPTION) {
      toast.error("Both fields required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(CODE)) {
      toast.error("Code max 6 alphanumeric");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(DESCRIPTION)) {
      toast.error("Description max 15 alphanumeric");
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
    const val = search?.toLowerCase();
    const filtered = ColorMasterList.filter(
      (c) =>
        c.CODE?.toLowerCase().includes(val) ||
        c.DESCRIPTION?.toLowerCase().includes(val)
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
      toast.success("Color Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({ ID: null, CODE: "", DESCRIPTION: "" });
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
    {
      headername: "Description",
      fieldname: "DESCRIPTION",
      type: "String",
      width: "200px",
    },
    {
      headername: "Process Serial",
      fieldname: "PROCESS_SERIAL",
      type: "Number",
      width: "150px",
    },
    {
      headername: "Execution Days",
      fieldname: "EXECUTION_DAYS",
      type: "Number",
      width: "150px",
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

export default ProcessTable;
