// Layout4Master.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import Layout4Table from "./Layout4Table";
import SearchableDropDown from "../../Components/SearchableDropDown";
import useLayout7Master from "../../Store/MasterStore/useLayout7Master";
import useLayout4Master from "../../Store/MasterStore/useLayout4Master";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";

function Layout4Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [type] = useState("stm"); // <-- Staff MASTER

  const [inputData, setInputData] = useState({
    Staff_Code: "",
    Staff_Name: "",
    Contact: "",
    ID_master: -1,
    Address1: "",
    Address2: "",
    Address3: "",
  });

  const { layout7, fetchLayout7 } = useLayout7Master();

  const dropdownList = useMemo(() => {
    return layout7.map((item) => ({
      label: `${item.Process_Code}`,
      value: item.Process_ID,
    }));
  }, [layout7]);

  const {
    fetchLayout4,

    // Add
    addIsLoading,
    addError,
    addIsSuccess,
    addLayout4,
    clearAddState,
  } = useLayout4Master();

  useEffect(() => {
    inputRef.current?.focus();
    fetchLayout7();
    fetchLayout4(type); // fetch layout4 with type
  }, [type]);

  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "Contact" && value && value.length > 10) {
      if (!PhnoValidation(value)) {
        return;
      }
      return;
    }
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const SaveData = () => {
    const { Staff_Code, Staff_Name } = inputData;

    if (!Staff_Code || !Staff_Name) {
      toast.error("Code and Name are mandatory");
      return;
    }

    if (!/^[a-zA-Z0-9]{1,6}$/.test(Staff_Code)) {
      toast.error("Code must be alphanumeric & max 6 chars");
      return;
    }

    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(Staff_Name)) {
      toast.error("Name must be alphanumeric & max 100 chars");
      return;
    }

    if (inputData.Contact && !/^\d{10}$/.test(inputData.Contact)) {
      toast.error("Contact No must be numeric & exactly 10 digits");
      return;
    }

    addLayout4(type, inputData);
  };

  // Handle Add Success/Error
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Staff Added Successfully");
      setInputData({
        Staff_Code: "",
        Staff_Name: "",
        Contact: "",
        ID_master: -1,
        Address1: "",
        Address2: "",
        Address3: "",
      });
      fetchLayout4(type); // refresh table after adding
    }
    if (addError && !addIsLoading && !addIsSuccess) {
      toast.error(addError);
    }
    clearAddState();
  }, [addIsLoading, addIsSuccess, addError]);

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <div className="d-flex align-items-center">
            <h5 className="mb-0 text-sm md:text-base">Staff Master</h5>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Input Fields */}
        <Col xs={12}>
          <Row className="align-items-center">
            <Col xs={12} md={12}>
              <div className="mb-2" style={{ overflowX: "auto" }}>
                <table className="text-sm">
                  <thead className="tab-head">
                    <tr>
                      <th></th>
                      <th className="text-xs md:text-sm">Code*</th>
                      <th className="text-xs md:text-sm">Name*</th>
                      <th className="text-xs md:text-sm">Address 1</th>
                      <th className="text-xs md:text-sm">Address 2</th>
                      <th className="text-xs md:text-sm">Address 3</th>
                      <th className="text-xs md:text-sm">Contact No</th>
                      <th className="text-xs md:text-sm">Process</th>
                    </tr>
                  </thead>
                  <tbody className="tab-body">
                    <tr>
                      <td>
                        <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                      </td>
                      <td>
                        <input
                          placeholder="Enter Code"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Staff_Code"
                          value={inputData?.Staff_Code || ""}
                          onChange={OnChangeHandler}
                          maxLength={6}
                          ref={inputRef}
                          style={{ width: "120px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Enter Name"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Staff_Name"
                          value={inputData?.Staff_Name || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          style={{ width: "180px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Address Line 1"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Address1"
                          value={inputData?.Address1 || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Address Line 2"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Address2"
                          value={inputData?.Address2 || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Address Line 3"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Address3"
                          value={inputData?.Address3 || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Enter Contact"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Contact"
                          value={inputData?.Contact || ""}
                          onChange={OnChangeHandler}
                          maxLength={10}
                          style={{ width: "150px" }}
                          type="number"
                        />
                      </td>
                      <td>
                        <SearchableDropDown
                          options={dropdownList}
                          handleChange={(e) =>
                            setInputData((prev) => ({
                              ...prev,
                              ID_master: e.target.value,
                            }))
                          }
                          selectedVal={inputData?.ID_master || -1}
                          label={"ID_master"}
                          placeholder={"--Select Type--"}
                          key={1}
                          defaultval={-1}
                          width={"100%"}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>

            {/* Submit Button */}
            <Col xs={12} md={12} className="text-start text-md-center">
              <Button
                variant="success"
                onClick={SaveData}
                disabled={isDisable}
                className="text-xs md:text-sm py-1 mt-2 mt-md-0"
                size="sm"
              >
                {addIsLoading ? "Please wait..." : "Submit"}
              </Button>
            </Col>
          </Row>
        </Col>

        {/* Detail & Search Row */}
        <Col xs={12} className="my-2">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-2">
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 flex-grow-1 w-100">
              <div className="flex-grow-1" style={{ minWidth: "180px" }}>
                <textarea
                  value={textDetail}
                  readOnly
                  placeholder="Detail View"
                  className="w-100 border border-blue-400 rounded p-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none"
                  rows={2}
                />
              </div>
              <div className="flex-grow-1" style={{ minWidth: "180px" }}>
                <div className="flex items-center border border-blue-400 rounded-md p-1 text-xs md:text-sm focus-within:ring-1 focus-within:ring-blue-300">
                  <i className="bi bi-search text-gray-400 mx-1"></i>
                  <input
                    value={searchData}
                    type="search"
                    placeholder="Search here..."
                    onChange={(e) => setSearchData(e.target.value)}
                    className="w-100 border-0 outline-none bg-transparent px-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={12}>
          <Layout4Table
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type={type} // Pass type to table if needed
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Layout4Master;
