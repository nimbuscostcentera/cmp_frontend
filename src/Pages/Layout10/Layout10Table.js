// pages/Layout10Master/Layout10Table.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout10Master from "../../Store/MasterStore/useLayout10Master";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";

function Layout10Table({ setIsDisable, search, setTextDetail, type }) {
  const editInputRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    Sub_ID: "",
    Sub_Code: "",
    Description: "",
    Pcs: "",
    Weight: "",
    ID_Group: "",
  });

  const {
    layout10: items,
    fetchLayout10,
    updateLayout10,
    deleteLayout10,
    addIsSuccess,
    updateIsLoading,
    updateError,
    updateIsSuccess,
    clearUpdateState,
    deleteIsLoading,
    deleteError,
    deleteIsSuccess,
    clearDeleteState,
    fetchIsLoading,
  } = useLayout10Master();


    const { layout2, fetchLayout2 } = useLayout2Master();

    const dropdownList = useMemo(() => {
      return layout2.map((item) => ({
        label: `${item.Code}`,
        value: item.ID,
      }));
    }, [layout2, type]);

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        Sub_ID: selected.Sub_ID,
        Sub_Code: selected.Sub_Code,
        Description: selected.Description,
        Pcs: selected.Pcs,
        Weight: selected.Weight,
        ID_Group: selected.ID_Group,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { Sub_Code, Description, Pcs, Weight, ID_Group, Sub_ID } = editedData;

    if (!Sub_Code || !Description || !Pcs || !Weight || !ID_Group) {
      toast.error("All fields are required");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Sub_Code)) {
      toast.error("Sub Code max 6 alphanumeric");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description max 15 alphanumeric");
      return;
    }
    if (isNaN(Pcs) || parseInt(Pcs) <= 0) {
      toast.error("Pcs must be a valid number");
      return;
    }
    if (isNaN(Weight) || parseFloat(Weight) <= 0) {
      toast.error("Weight must be a valid decimal");
      return;
    }

    updateLayout10(type, Sub_ID, {
      Sub_Code,
      Description,
      Pcs,
      Weight,
      ID_Group,
    });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout10(type, obj.Sub_ID);
  };

  // Filter data based on search
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.Sub_Code?.toLowerCase().includes(val) ||
        item.Description?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, items]);

  // Fetch items on mount or type change
  useEffect(() => {
    if (type) fetchLayout10(type);
  }, [type, addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess && !updateIsLoading && !updateError) {
      toast.success(`Stone Sub Master updated successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Sub_ID: "",
        Sub_Code: "",
        Description: "",
        Pcs: "",
        Weight: "",
        ID_Group: "",
      });
      setIsDisable(false);
      clearUpdateState();
    }
    if (updateError && !updateIsLoading && !updateIsSuccess) {
      toast.error(updateError);
      clearUpdateState();
    }
  }, [updateIsSuccess, updateError, updateIsLoading]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess && !deleteIsLoading && !deleteError) {
      toast.success(`Stone Sub Master deleted successfully`);
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        Sub_ID: "",
        Sub_Code: "",
        Description: "",
        Pcs: "",
        Weight: "",
        ID_Group: "",
      });
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
      headername: "Sub Code",
      fieldname: "Sub_Code",
      type: "String",
      width: "120px",
    },
    { headername: "Description", fieldname: "Description", type: "String" },
    { headername: "Pcs", fieldname: "Pcs", type: "Number", width: "80px" },
    {
      headername: "Weight",
      fieldname: "Weight",
      type: "Number",
      width: "100px",
    },
   
    {
      headername: "Stone",
      fieldname: "Code",
      selectionname: "ID_Group",
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
        OnChangeHandler={(i, e) => {
          const { name, value } = e.target;
          if (name === "WgtPerPcs" && value !== "") {
            const regex = /^\d{1,6}\.?\d{0,3}$/; // up to 3 decimal places and before . 6 place can be filled
            if (!regex.test(value)) {
              return;
            }
          }
          setEditedData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }}
        OnSaveHandler={SaveChange}
        getFocusText={(val) => setTextDetail(val)}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={updateIsLoading || deleteIsLoading || fetchIsLoading}
        useInputRef={editInputRef}
        isDelete={true}
        handleDelete={handleDelete}
        height={"40vh"}
      />
    </div>
  );
}

export default Layout10Table;
