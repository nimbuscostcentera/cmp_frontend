import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import useAuth from "../../Store/AuthStore/useAuth";
import UserTable from "./UserTable";

function UserMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  // ✅ Form state for UserMaster
  const [userData, setUserData] = useState({
    User_Name: "",
    Contact: "",
    Password: "",
    UType: "U",
    active: true,
  });

  const {
    registerIsLoading,
    registerError,
    registerIsSuccess,
    registerUser,
    clearRegisterState,
  } = useAuth();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle input changes
  const OnChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    // Validation for Contact field
    if (name === "Contact") {
      if (value && !/^\d{0,10}$/.test(value)) {
        return;
      }
    }

    // Validation for Password field
    if (name === "Password") {
      if (value.length > 255) {
        toast.error("Password must be maximum 255 characters");
        return;
      }
    }

    // Validation for User_Name field
    if (name === "User_Name") {
      if (value.length > 255) {
        toast.error("Name must be maximum 255 characters");
        return;
      }
    }

    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save new user
  const SaveData = () => {
    const { User_Name, Contact, Password, UType } = userData;

    if (!User_Name || !Contact || !Password || !UType) {
      toast.error("All fields are mandatory");
      return;
    }

    if (Contact.length !== 10) {
      toast.error("Contact must be exactly 10 digits");
      return;
    }

    if (User_Name.length > 255) {
      toast.error("Name must be maximum 255 characters");
      return;
    }

    if (Password.length > 255) {
      toast.error("Password must be maximum 255 characters");
      return;
    }

    registerUser(userData);
  };

  // Handle success & error
  useEffect(() => {
    if (registerIsSuccess && !registerIsLoading && !registerError) {
      toast.success("User Added Successfully");
      setUserData({
        User_Name: "",
        Contact: "",
        Password: "",
        UType: "U",
        active: true,
      });
    }
    if (registerError && !registerIsLoading && !registerIsSuccess) {
      toast.error(registerError);
    }
    // clearRegisterState();
  }, [registerIsLoading, registerIsSuccess, registerError]);

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <div className="d-flex align-items-center">
            <h5 className="mb-0 text-sm md:text-base">User Master</h5>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Input Form */}
      

        {/* Textarea & Search */}
        <Col xs={12} className="my-2">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-2">
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 flex-grow-1 w-100">
              <div className="flex-grow-1" style={{ minWidth: "180px" }}>
                <textarea
                  value={textDetail}
                  readOnly
                  placeholder="Detail View"
                  className="w-100 border border-blue-400 rounded p-2 text-xs md:text-sm focus:outline-none resize-none"
                  rows={2}
                />
              </div>
              <div className="flex-grow-1" style={{ minWidth: "180px" }}>
                <div className="flex items-center border border-blue-400 rounded-md p-1 text-xs md:text-sm">
                  <i className="bi bi-search text-gray-400 mx-1"></i>
                  <input
                    value={searchData}
                    type="search"
                    placeholder="Search users..."
                    onChange={(e) => setSearchData(e.target.value)}
                    className="w-100 border-0 outline-none bg-transparent px-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Table */}
        <Col xs={12}>
          <UserTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default UserMaster;
