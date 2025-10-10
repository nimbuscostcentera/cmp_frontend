import React, { useEffect, useRef, useState } from "react";
import Table from "../../Components/Table";
import { toast } from "react-toastify";
import useAuth from "../../Store/AuthStore/useAuth";

function UserTable({ setIsDisable, search, setTextDetail }) {
  const editinputref = useRef(null);

  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({ ActionID: -1, IsAction: false });
  const [editedData, setEditedData] = useState({
    User_ID: null,
    User_Name: "",
    Contact: "",
    Password: "",
    UType: "U",
    active: true,
  });

  const {
    userList,
    fetchUsers,
    showIsLoading,

    editUser,
    editIsSuccess,
    editError,
    clearEditState,

    deleteUser,
    deleteIsSuccess,
    deleteError,
    clearDeleteState,
  } = useAuth();

  // Enable editing
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selected = filteredData[tabIndex];
    if (selected) {
      setEditedData({
        User_ID: selected.User_ID,
        User_Name: selected.User_Name,
        Contact: selected.Contact,
        Password: "", // Don't show password when editing
        UType: selected.UType,
        active: selected.active,
      });
    }
  };

  // Save changes
  const SaveChange = () => {
    const { User_Name, Contact, Password, UType, active } = editedData;

    if (!User_Name || !Contact || !UType) {
      toast.error("Name, Contact and User Type are mandatory");
      return;
    }

    if (User_Name.length > 255) {
      toast.error("Name must be maximum 255 characters");
      return;
    }

    if (!/^\d{10}$/.test(Contact)) {
      toast.error("Contact must be exactly 10 digits");
      return;
    }

    // Only validate password if it's being changed (not empty)
    if (Password && Password.length > 255) {
      toast.error("Password must be maximum 255 characters");
      return;
    }

    const updateData = {
      User_Name,
      Contact,
      UType,
      active,
      ...(Password && { Password }), // Only include password if it's not empty
    };

    editUser(editedData.User_ID, updateData);
  };

  // Delete
  const handleDelete = (id) => {
    const obj = filteredData[id];
    if (obj) {
      if (
        window.confirm(
          `Are you sure you want to delete user: ${obj.User_Name}?`
        )
      ) {
        deleteUser(obj.User_ID);
      }
    }
  };

  // Search filter
  useEffect(() => {
    const val = search.toLowerCase();
    const filtered = userList?.filter(
      (user) =>
        user.User_ID?.toString().includes(val) ||
        user.User_Name?.toLowerCase().includes(val) ||
        user.Contact?.includes(val) ||
        user.UType?.toLowerCase().includes(val) ||
        (user.active ? "active" : "inactive").includes(val)
    );
    setFilteredData(filtered);
  }, [search, userList]);

  // Fetch list on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle update success/error
  useEffect(() => {
    if (editIsSuccess) {
      toast.success("User Updated Successfully");
      setParams({ IsAction: false, ActionID: -1 });
      setEditedData({
        User_ID: null,
        User_Name: "",
        Contact: "",
        Password: "",
        UType: "U",
        active: true,
      });
      setIsDisable(false);
      fetchUsers();
    }
    if (editError) toast.error(editError);
    clearEditState();
  }, [editIsSuccess, editError]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("User Deleted Successfully");
      fetchUsers();
    }
    if (deleteError) toast.error(deleteError);
    clearDeleteState();
  }, [deleteIsSuccess, deleteError]);

  // User type options for dropdown
  const userTypeOptions = [
    { value: "U", label: "User" },
    { value: "A", label: "Admin" },
    { value: "S", label: "SuperUser" },
  ];

  const Col = [
    {
      headername: "Name",
      fieldname: "User_Name",
      type: "String",
      width: "200px",
      isUseInputRef: true,
    },
    {
      headername: "Contact",
      fieldname: "Contact",
      type: "String",
      width: "120px",
    },
    {
      headername: "User Type",
      fieldname: "UType",
      type: "String",
      width: "120px",
      isSelection: true,
      selectionname: "UType",
      options: userTypeOptions,
    },
    {
      headername: "Status",
      fieldname: "active",
      type: "Boolean",
      width: "100px",
      isSelection: true,
      selectionname: "active",
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ],
    },
  ];

  // Format data for display
  const formatUserData = (data) => {
    return data.map((user) => ({
      ...user,
      // Don't show password in view mode
      // Format active status for display
      active: user.active ? "Active" : "Inactive",
      // Format user type for display
      UType:
        userTypeOptions.find((opt) => opt.value === user.UType)?.label ||
        user.UType,
    }));
  };

  const handleInputChange = (i, e) => {
    const { name, value, type, checked } = e.target;

    // Special validation for Contact field
    if (name === "Contact") {
      // Allow only numbers and max 10 digits
      if (value && !/^\d{0,10}$/.test(value)) {
        return;
      }
    }

    // Special validation for Password field
    if (name === "Password") {
      // Allow up to 255 characters
      if (value.length > 255) {
        return;
      }
    }

    // Special validation for User_Name field
    if (name === "User_Name") {
      // Allow up to 255 characters
      if (value.length > 255) {
        return;
      }
    }

    setEditedData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="table-box">
      <Table
        tab={formatUserData(filteredData) || []}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        OnChangeHandler={handleInputChange}
        OnSaveHandler={SaveChange}
        getFocusText={(val) => setTextDetail(val)}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={showIsLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        height={"50vh"}
        onCancel={() => {
          setParams({ IsAction: false, ActionID: -1 });
          setEditedData({
            User_ID: null,
            User_Name: "",
            Contact: "",
            Password: "",
            UType: "U",
            active: true,
          });
          setIsDisable(false);
        }}
      />
    </div>
  );
}

export default UserTable;
