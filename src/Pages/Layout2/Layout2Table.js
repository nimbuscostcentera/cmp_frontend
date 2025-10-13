import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";
import useLayout9Master from "../../Store/MasterStore/useLayout9Master";
import useLayout7Master from "../../Store/MasterStore/useLayout7Master";

function Layout2Table({ setIsDisable, search, setTextDetail, type }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: null,
    Code: "",
    Description: "",
    ID_master: -1,
  });

  // Masters
  const { units, fetchUnits } = useLayout9Master();
  const { layout7, fetchLayout7 } = useLayout7Master();

  // Dropdown based on type
  const dropdownList = useMemo(() => {
    if (type === "sm") {
      return units.map((item) => ({
        label: `${item.Unit_Code}`,
        value: item.Unit_ID,
      }));
    } else {
      return layout7.map((item) => ({
        label: `${item.Process_Code}`,
        value: item.Process_ID,
      }));
    }
  }, [units, layout7, type]);

  const {
    layout2,
    fetchLayout2,
    isLoading: fetchIsLoading,
    addLayout2,
    updateLayout2,
    deleteLayout2,
    addIsSuccess,
    updateIsSuccess,
    deleteIsSuccess,
    addError,
    updateError,
    deleteError,
    clearAddState,
    clearUpdateState,
    clearDeleteState,
  } = useLayout2Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        ID: selected.ID,
        Code: selected.Code,
        Description: selected.Description,
        ID_master: selected.ID_master || -1,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { ID, Code, Description, ID_master } = editedData;
    if (!Code || !Description || ID_master === -1) {
      toast.error("All fields required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Code)) {
      toast.error("Code max 6 alphanumeric");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description max 15 alphanumeric");
      return;
    }

    updateLayout2(type, ID, { Code, Description, ID_master });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout2(type, obj.ID);
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = layout2.filter(
      (item) =>
        item.Code?.toLowerCase().includes(val) ||
        item.Description?.toLowerCase().includes(val) ||
        (type === "sm"
          ? item.Unit_Code?.toLowerCase().includes(val)
          : item.Process_Code?.toLowerCase().includes(val))
    );
    setFilteredData(filtered);
  }, [search, layout2, type]);

  // Fetch list + masters
  useEffect(() => {
    fetchLayout2(type);
    if (type === "sm") {
      fetchUnits();
    } else {
      fetchLayout7();
    }
  }, [type, addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle add/update/delete success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Updated successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({ ID: null, Code: "", Description: "", ID_master: -1 });
      setIsDisable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();

    if (deleteIsSuccess) toast.success("Deleted successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [updateIsSuccess, deleteIsSuccess, updateError, deleteError]);

  // Dynamic columns based on type
  const Col = [
    { headername: "Code", fieldname: "Code", type: "String", width: "120px" },
    { headername: "Description", fieldname: "Description", type: "String" },
    {
      headername: type === "sm" ? "Unit" : "Process",
      fieldname: type === "sm" ? "Unit_Code" : "Process_Code",
      selectionname: "ID_master",
      type: "String",
      isSelection: true,
      options: dropdownList,
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

export default Layout2Table;
