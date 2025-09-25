import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout11Master from "../../Store/MasterStore/useLayout11Master";
import useLayout13Master from "../../Store/MasterStore/useLayout13Master";

// ✅ Metal choices
const metalTypeMap = [
  { value: "P", label: "Pure" },
  { value: "B", label: "Brass" },
  { value: "A", label: "Alloy" },
  { value: "M", label: "Model" },
  { value: "S", label: "Scrap" },
  { value: "O", label: "Others" },
];

function Layout11Table({ setIsDisable, search, setTextDetail, type }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });

  // ✅ Keep state aligned with Layout11Master
  const [editedData, setEditedData] = useState({
    id: null,
    Metal_Type: "P",
    System_Name: "Default System",
    Company_Name: "",
  });

  // Get company list for dropdown
  const { layout13 } = useLayout13Master();
  const dropdownList = useMemo(() => {
    return layout13?.map((item) => ({
      label: `${item.Company_Code}`,
      value: item.Company_ID,
    }));
  }, [layout13]);

  // Zustand store
  const {
    layout11,
    fetchLayout11,
    fetchIsLoading,
    addIsSuccess,
    updateLayout11,
    updateIsSuccess,
    updateError,
    clearUpdateState,
    deleteLayout11,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useLayout11Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        id: selected.id,
        Metal_Type: selected.Metal_Type,
        System_Name: selected.System_Name,
        Company_Name: selected.Company_Name,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { id, Metal_Type, System_Name, Company_Name } = editedData;

    if (!Metal_Type) {
      toast.error("Metal Type is required");
      return;
    }

    updateLayout11(type, id, {
      Metal_Type,
      System_Name,
      Company_Name,
    });
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) deleteLayout11(type, obj.id);
  };

  // Search filter
  useEffect(() => {
    const val = search?.toLowerCase();
    const mapped = layout11.map((item) => ({
      ...item,
      Metal_Type_Label:
        metalTypeMap.find((m) => m.value === item.Metal_Type)?.label ||
        item.Metal_Type,
    }));

    const filtered = mapped.filter(
      (c) =>
        c.Metal_Type_Label?.toLowerCase().includes(val) ||
        c.System_Name?.toLowerCase().includes(val)
    );

    setFilteredData(filtered);
  }, [search, layout11]);

  // Fetch list
  useEffect(() => {
    fetchLayout11(type);
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle update success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("System Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        id: null,
        Metal_Type: "P",
        System_Name: "Default System",
        Company_Name: "",
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
      headername: "Metal Type",
      fieldname: "Metal_Type_Label",
      selectionname: "Metal_Type",
      type: "String",
      isSelection: true,
      options: metalTypeMap,
      width: "150px",
    },
    {
      headername: "System Name",
      fieldname: "System_Name",
      type: "String",
      width: "200px",
    },
    {
      headername: "Company",
      fieldname: "Company_Code",
      selectionname: "Company_Name",
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

export default Layout11Table;
