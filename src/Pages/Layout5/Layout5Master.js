// CustomerMaster.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import useAddColorMaster from "../../Store/AddStore/useAddColorMaster";
import "../../Components/Table/table.css";
import Layout5Table from "./Layout5Table";
import SearchableDropDown from "../../Components/SearchableDropDown";

function Layout5Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  const [inputData, setInputData] = useState({
    NAME: "",
    ADDRESS1: "",
    ADDRESS2: "",
    ADDRESS3: "",
    CONTACT: "",
    id_master: 2, // Default to Customer
  });

  const typeArr = [
    { label: 1, value: "Self" },
    { label: 2, value: "Customer" },
  ];

  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item?.value}`,
      value: item?.label,
    }));
  }, [typeArr]);

  const {
    ColorMasterError,
    isColorMasterLoading,
    ColorMasterSuccess,
    ColorMasterAdd,
    ClearStateColorMasterAdd,
  } = useAddColorMaster();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "CONTACT") {
      if (value && value.length > 10) {
        return;
      }
    }
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const SaveData = () => {
    const { NAME } = inputData;

    // Mandatory validation
    if (!NAME) {
      toast.error("Name is mandatory");
      return;
    }

    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(NAME)) {
      toast.error("Name must be alphanumeric & max 100 chars");
      return;
    }

    // Optional fields validations
    for (let i = 1; i <= 3; i++) {
      if (
        inputData[`ADDRESS${i}`] &&
        !/^[a-zA-Z0-9 ]{0,100}$/.test(inputData[`ADDRESS${i}`])
      ) {
        toast.error(`Address line ${i} must be alphanumeric & max 100 chars`);
        return;
      }
    }

    if (inputData.CONTACT && !/^[a-zA-Z0-9 ]{0,30}$/.test(inputData.CONTACT)) {
      toast.error("Contact No must be alphanumeric & max 30 chars");
      return;
    }

    ColorMasterAdd(inputData);
  };

  useEffect(() => {
    if (ColorMasterSuccess && !isColorMasterLoading && !ColorMasterError) {
      toast.success("Customer Added Successfully");
      setInputData({
        NAME: "",
        ADDRESS1: "",
        ADDRESS2: "",
        ADDRESS3: "",
        CONTACT: "",
        id_master: 2, // Reset to Customer default
      });
    }
    if (ColorMasterError && !isColorMasterLoading && !ColorMasterSuccess) {
      toast.error(ColorMasterError);
    }
    ClearStateColorMasterAdd();
  }, [isColorMasterLoading, ColorMasterSuccess, ColorMasterError]);

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
              <div className=" mb-2" style={{ overflowX: "auto" }}>
                <table className="text-sm">
                  <thead className="tab-head">
                    <tr>
                      <th></th>
                      <th className="text-xs md:text-sm">Name*</th>
                      <th className="text-xs md:text-sm">Address 1</th>
                      <th className="text-xs md:text-sm">Address 2</th>
                      <th className="text-xs md:text-sm">Address 3</th>
                      <th className="text-xs md:text-sm">Contact No</th>
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
                          name="NAME"
                          value={inputData?.NAME || ""}
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
                          name="ADDRESS1"
                          value={inputData?.ADDRESS1 || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Address Line 2"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="ADDRESS2"
                          value={inputData?.ADDRESS2 || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Address Line 3"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="ADDRESS3"
                          value={inputData?.ADDRESS3 || ""}
                          onChange={OnChangeHandler}
                          maxLength={100}
                          style={{ width: "190px" }}
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Enter Contact"
                          className="input-cell form-input text-xs md:text-sm py-1"
                          name="CONTACT"
                          value={inputData?.CONTACT || ""}
                          onChange={OnChangeHandler}
                          maxLength={10}
                          type="number"
                          style={{ width: "150px" }}
                        />
                      </td>
                      <td>
                        <SearchableDropDown
                          options={typeList}
                          handleChange={(e) => OnChangeHandler(e)}
                          selectedVal={inputData?.id_master || 2}
                          label={"id_master"}
                          placeholder={"--Select Type--"}
                          key={1}
                          defaultval={2}
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
                {isColorMasterLoading ? "Please wait..." : "Submit"}
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
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Layout5Master;
