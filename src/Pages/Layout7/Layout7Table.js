import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout7Master from "../../Store/MasterStore/useLayout7Master";

function Layout7Table({ setIsDisable, search, setTextDetail, type }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  // keep your original editedData structure
  const [editedData, setEditedData] = useState({
    Process_ID: null,
    Process_Code: "",
    Description: "",
    Process_Serial: "",
    Execution_Days: "",
    Design_Stock_Effect: false,
  });

  // Zustand store
  const {
    layout7,
    fetchLayout7,
    fetchIsLoading,
    addIsSuccess,
    updateLayout7,
    updateIsSuccess,
    updateError,
    clearUpdateState,
    deleteLayout7,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useLayout7Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        Process_ID: selected.Process_ID,
        Process_Code: selected.Process_Code,
        Description: selected.Description,
        Process_Serial: selected.Process_Serial,
        Execution_Days: selected.Execution_Days,
        Design_Stock_Effect: selected.Design_Stock_Effect,
      });
  };

  // Save changes
  const SaveChange = () => {
    const {
      Process_ID,
      Process_Code,
      Description,
      Process_Serial,
      Execution_Days,
      Design_Stock_Effect,
    } = editedData;

    if (!Process_Code || !Description) {
      toast.error("Code and Description are required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,15}$/.test(Process_Code)) {
      toast.error("Code must be alphanumeric & max 15 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,30}$/.test(Description)) {
      toast.error("Description must be alphanumeric & max 30 chars");
      return;
    }

    updateLayout7(type, Process_ID, {
      Process_Code,
      Description,
      Process_Serial,
      Execution_Days,
      Design_Stock_Effect,
    });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout7(type, obj.Process_ID);
  };

  // Search filter
  useEffect(() => {
    const val = search?.toLowerCase();
    const filtered = layout7.filter(
      (c) =>
        c.Process_Code?.toLowerCase().includes(val) ||
        c.Description?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, layout7]);

  // Fetch list
  useEffect(() => {
    fetchLayout7(type);
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Process Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Process_ID: null,
        Process_Code: "",
        Description: "",
        Process_Serial: "",
        Execution_Days: "",
        Design_Stock_Effect: false,
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
      headername: "Process Code",
      fieldname: "Process_Code",
      type: "String",
      width: "150px",
    },
    {
      headername: "Description",
      fieldname: "Description",
      type: "String",
      width: "200px",
    },
    {
      headername: "Process Serial",
      fieldname: "Process_Serial",
      type: "Number",
      width: "150px",
    },
    {
      headername: "Execution Days",
      fieldname: "Execution_Days",
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
            [e.target.name]:
              e.target.type === "checkbox" ? e.target.checked : e.target.value,
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

export default Layout7Table;
