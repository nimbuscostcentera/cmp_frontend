// Layout5Master.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import Layout5Table from "./Layout5Table";
import SearchableDropDown from "../../Components/SearchableDropDown";
import useLayout5Master from "../../Store/MasterStore/useLayout5Master";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";

function Layout5Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [type , setType] = useState("csm"); // Default = Customer

  const [inputData, setInputData] = useState({
    Customer_Name: "",
    Address1: "",
    Address2: "",
    Address3: "",
    Contact: "",
    ID_Type: "2", // Default = Customer
  });

  const typeArr = [
    { label: "1", value: "Self" },
    { label: "2", value: "Customer" },
  ];

  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item?.value}`,
      value: item?.label,
    }));
  }, [typeArr]);

  // Zustand store methods & states
  const { addLayout5, addIsLoading, addIsSuccess, addError, clearAddState } =
    useLayout5Master();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const OnChangeHandler = (e) => {
    const { name, value } = e.target || {};
    if (name === "Contact") {
      if (value && value.length > 10) {
        return;
      }
      if(!PhnoValidation(value)) {
        return;
      }
    }
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const SaveData = () => {
    const { Customer_Name } = inputData;

    // Mandatory validation
    if (!Customer_Name) {
      toast.error("Name is mandatory");
      return;
    }

    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(Customer_Name)) {
      toast.error("Name must be alphanumeric & max 100 chars");
      return;
    }

    // Optional address validations
    for (let i = 1; i <= 3; i++) {
      if (
        inputData[`Address${i}`] &&
        !/^[a-zA-Z0-9 ]{0,100}$/.test(inputData[`Address${i}`])
      ) {
        toast.error(`Address line ${i} must be alphanumeric & max 100 chars`);
        return;
      }
    }

    if (inputData.Contact && !/^[a-zA-Z0-9 ]{0,30}$/.test(inputData.Contact)) {
      toast.error("Contact must be alphanumeric & max 30 chars");
      return;
    }

    addLayout5(type, inputData); // Pass type = csm (Customer Master)
  };

  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Customer Added Successfully");
      setInputData({
        Customer_Name: "",
        Address1: "",
        Address2: "",
        Address3: "",
        Contact: "",
        ID_Type: "2",
      });
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
            <h5 className="mb-0 text-sm md:text-base">Customer Master</h5>
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
                      <th className="text-xs md:text-sm">Name*</th>
                      <th className="text-xs md:text-sm">Address 1</th>
                      <th className="text-xs md:text-sm">Address 2</th>
                      <th className="text-xs md:text-sm">Address 3</th>
                      <th className="text-xs md:text-sm">Contact</th>
                      <th className="text-xs md:text-sm">ID Type</th>
                    </tr>
                  </thead>
                  <tbody className="tab-body">
                    <tr>
                      <td>
                        <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                      </td>
                      <td>
                        <input
                          placeholder="Enter Name"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Customer_Name"
                          value={inputData?.Customer_Name || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          ref={inputRef}
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
                          maxLength={30}
                          type="text"
                          style={{ width: "150px" }}
                        />
                      </td>
                      <td>
                        <SearchableDropDown
                          options={typeList}
                          handleChange={(e) =>
                            setInputData((prev) => ({
                              ...prev,
                              ID_Type: e.value,
                            }))
                          }
                          selectedVal={inputData?.ID_Type || "2"}
                          label={"ID_Type"}
                          placeholder={"--Select Type--"}
                          key={1}
                          defaultval={"2"}
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
                onClick={() => SaveData()}
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
          <Layout5Table
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type={type}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Layout5Master;
