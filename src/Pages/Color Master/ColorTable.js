import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useColorMaster from "../../Store/AddStore/useAddColorMaster";

function ColorMasterTable({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    Color_ID: "",
    Color_Code: "",
    Description: "",
  });

  const [CompanyID] = useState(1);

  const {
    colors,
    fetchColors,

    updateColor,
    deleteColor,

    // update states
    updateIsLoading,
    updateError,
    updateIsSuccess,
    clearUpdateState,

    // delete states
    deleteIsLoading,
    deleteError,
    deleteIsSuccess,
    clearDeleteState,

    // fetch states
    fetchIsLoading,
  } = useColorMaster();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        Color_ID: selected.Color_ID,
        Color_Code: selected.Color_Code,
        Description: selected.Description,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { Color_Code, Description, Color_ID } = editedData;
    // if (!Color_Code || !Description) {
    //   toast.error("Both fields required");
    //   return;
    // }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Color_Code)) {
      toast.error("Code max 6 alphanumeric");
      return;
    }
    // if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
    //   toast.error("Description max 15 alphanumeric");
    //   return;
    // }
    updateColor(Color_ID, { Color_Code, Description, CompanyID });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteColor(obj.Color_ID);
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = colors.filter(
      (c) =>
        c.Color_Code?.toLowerCase().includes(val) ||
        c.Description?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, colors]);

  // Fetch list on mount
  useEffect(() => {
    fetchColors();
  }, []);

  // ✅ Handle Update Success/Error
  useEffect(() => {
    if (updateIsSuccess && !updateIsLoading && !updateError) {
      toast.success("Color Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({ Color_ID: "", Color_Code: "", Description: "" });
      setIsDisable(false);
      clearUpdateState();
    }
    if (updateError && !updateIsLoading && !updateIsSuccess) {
      toast.error(updateError);
      clearUpdateState();
    }
  }, [updateIsSuccess, updateError, updateIsLoading]);

  // ✅ Handle Delete Success/Error
  useEffect(() => {
    if (deleteIsSuccess && !deleteIsLoading && !deleteError) {
      toast.success("Color Deleted Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({ Color_ID: "", Color_Code: "", Description: "" });
      setIsDisable(false);
      clearDeleteState();
    }
    if (deleteError && !deleteIsLoading && !deleteIsSuccess) {
      toast.error(deleteError);
      clearDeleteState();
    }
  }, [deleteIsSuccess, deleteError, deleteIsLoading]);

  const Col = [
    {
      headername: "Code",
      fieldname: "Color_Code",
      type: "String",
      width: "120px",
    },
    { headername: "Description", fieldname: "Description", type: "String" },
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
        isLoading={updateIsLoading || deleteIsLoading || fetchIsLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        height={"40vh"}
      />
    </div>
  );
}

export default ColorMasterTable;
