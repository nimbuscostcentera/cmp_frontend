import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useFetchColorMaster from "../../Store/ShowStore/useFetchColorMaster";
import useEditColorMaster from "../../Store/UpdateStore/useEditColorMaster";
import useDeleteColorMaster from "../../Store/DeleteMasterStore/useDeleteColorMaster";

import useAddColorMaster from "../../Store/AddStore/useAddColorMaster";

function Layout2Table({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: null,
    CODE: "",
    DESCRIPTION: "",
    id_master: -1,
  });
  const typeArr = [
    { label: 1, value: "Customer" },
    { label: 2, value: "WholeSeller" },
    { label: 3, value: "Mahajon" },
  ];

  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item?.value}`,
      value: item?.label,
    }));
  }, [typeArr]);
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
    const val = search.toLowerCase();
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
    { headername: "Description", fieldname: "DESCRIPTION", type: "String" },
    {
      headername: "Unit",
      fieldname: "id_master",
      selectionname: "id_master",
      type: "String",
      isSelection: true,
      options: typeList,
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

export default Layout2Table;
