// Layout3Table.js
import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useLayout3Master from "../../Store/MasterStore/useLayout3Master";

function Layout3Table({ setIsDisable, search, setTextDetail, type }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    ID: null, // Added ID field
    Code: "",
    Name: "",
    Address1: "",
    Address2: "",
    Address3: "",
    Contact: "",
  });

  const [CompanyID] = useState(1);

  const {
    layout3, // this holds fetched data
    fetchLayout3,
    fetchIsLoading,

    updateLayout3,
    updateIsSuccess,
    updateError,
    clearUpdateState,

    deleteLayout3,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,

    addIsSuccess,
  } = useLayout3Master();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected)
      setEditedData({
        ID: selected.ID, // keep ID for internal reference
        Code: selected.Code,
        Name: selected.Name,
        Address1: selected.Address1,
        Address2: selected.Address2,
        Address3: selected.Address3,
        Contact: selected.Contact,
      });
  };

  // Save changes
  const SaveChange = () => {
    const { ID, Code, Name, Contact } = editedData;

    if (!Code || !Name) {
      toast.error("Code and Name are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Code)) {
      toast.error("Code must be alphanumeric & max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(Name)) {
      toast.error("Name must be alphanumeric & max 100 chars");
      return;
    }
    // for (let i = 1; i <= 3; i++) {
    //   if (
    //     editedData[`Address${i}`] &&
    //     !/^[a-zA-Z0-9 ]{0,255}$/.test(editedData[`Address${i}`])
    //   ) {
    //     toast.error(`Address line ${i} must be alphanumeric & max 255 chars`);
    //     return;
    //   }
    // }
    if (Contact && !/^\d{10}$/.test(Contact)) {
      toast.error("Contact No must be 10 digits only");
      return;
    }

    updateLayout3(type,ID, editedData); // Pass ID along with other fields
  };

  // Delete
  const handleDelete = (index) => {
    const obj = filteredData[index];
    if (obj) deleteLayout3(type, obj.ID); // use ID for deletion
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = layout3.filter(
      (c) =>
        c.Code?.toLowerCase().includes(val) ||
        c.Name?.toLowerCase().includes(val) ||
        c.Address1?.toLowerCase().includes(val) ||
        c.Address2?.toLowerCase().includes(val) ||
        c.Address3?.toLowerCase().includes(val) ||
        c.Contact?.toLowerCase().includes(val)
    );
    setFilteredData(filtered);
  }, [search, layout3]);

  // Fetch list on mount & when type changes or new data is added
  useEffect(() => {
    fetchLayout3(type); // fetch data based on selected type
  }, [type, addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Handle edit success/error
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Item Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        ID: null,
        Code: "",
        Name: "",
        Address1: "",
        Address2: "",
        Address3: "",
        Contact: "",
      });
      setIsDisable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess) toast.success("Item Deleted Successfully");
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  const Col = [
    { headername: "Code", fieldname: "Code", type: "String", width: "100px" },
    { headername: "Name", fieldname: "Name", type: "String", width: "150px" },
    { headername: "Address 1", fieldname: "Address1", type: "String" },
    { headername: "Address 2", fieldname: "Address2", type: "String" },
    { headername: "Address 3", fieldname: "Address3", type: "String" },
    { headername: "Contact No", fieldname: "Contact", type: "String" },
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
          if (name === "Contact" && value && value.length > 10) return;
          setEditedData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
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
        height={"40vh"}
      />
    </div>
  );
}

export default Layout3Table;
