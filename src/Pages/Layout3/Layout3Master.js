// Layout3Master.js
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import useLayout3Master from "../../Store/MasterStore/useLayout3Master";
import "../../Components/Table/table.css";
import Layout3Table from "./Layout3Table";
import masterMapping from "../../Utils/mastermapping";

function Layout3Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  const [type, setType] = useState("dlm"); // default type is "am"

  const [inputData, setInputData] = useState({
    Code: "",
    Name: "",
    Address1: "",
    Address2: "",
    Address3: "",
    Contact: "",
  });

  const { addLayout3, addIsLoading, addIsSuccess, addError, clearAddState } =
    useLayout3Master();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "Contact" && value && value.length > 10) return;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const SaveData = () => {
    const { Code, Name } = inputData;

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
    //     inputData[`Address${i}`] &&
    //     !/^[a-zA-Z0-9 ]{0,255}$/.test(inputData[`Address${i}`])
    //   ) {
    //     toast.error(`Address line ${i} must be alphanumeric & max 255 chars`);
    //     return;
    //   }
    // }

    if (inputData.Contact && !/^\d{10}$/.test(inputData.Contact)) {
      toast.error("Contact No must be numeric & exactly 10 digits");
      return;
    }

    addLayout3(type, inputData); // Pass selected type
  };

  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Item Added Successfully");
      setInputData({
        Code: "",
        Name: "",
        Address1: "",
        Address2: "",
        Address3: "",
        Contact: "",
      });
    }

    if (addError && !addIsLoading && !addIsSuccess) {
      toast.error(addError);
    }

    clearAddState();
  }, [addIsLoading, addIsSuccess, addError, clearAddState]);

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <div className="d-flex align-items-center">
            <h5 className="mb-0 text-sm md:text-base">{masterMapping[type]}</h5>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Input Fields */}
        <Col xs={12}>
          <Row className="align-items-center">
            <Col xs={12} md={10}>
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
                          name="Code"
                          value={inputData.Code}
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
                          name="Name"
                          value={inputData.Name}
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
                          value={inputData.Address1}
                          onChange={OnChangeHandler}
                          maxLength={255}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Address Line 2"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Address2"
                          value={inputData.Address2}
                          onChange={OnChangeHandler}
                          maxLength={255}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Address Line 3"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Address3"
                          value={inputData.Address3}
                          onChange={OnChangeHandler}
                          maxLength={255}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Enter Contact"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="Contact"
                          value={inputData.Contact}
                          onChange={OnChangeHandler}
                          maxLength={10}
                          style={{ width: "150px" }}
                          type="number"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>

            <Col xs={12} md={2} className="text-start text-md-center">
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
          <Layout3Table
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

export default Layout3Master;
