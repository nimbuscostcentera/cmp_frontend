import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import useLayout13Master from "../../Store/MasterStore/useLayout13Master";
import Layout13Table from "./Layout13Table";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";

function Layout13Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  // ✅ Form state for CompanyMaster
  const [companyData, setCompanyData] = useState({
    Company_Code: "",
    Company_Name: "",
    GSTIN: "",
    Active: true,
    Address: "",
    Contact: "",
  });

  const { addIsLoading, addError, addIsSuccess, addLayout13, clearAddState } =
    useLayout13Master();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle input changes
  const OnChangeHandler = (e) => {
      const { name, value, type, checked } = e.target;
      
      if (name === "Contact" && value.length > 10) {
        if(!PhnoValidation(value)){
          return;
          }
          return;
      }
    setCompanyData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save new company
  const SaveData = () => {
    const { Company_Code, Company_Name, GSTIN, Address, Contact } = companyData;

    if (!Company_Code || !Company_Name || !GSTIN) {
      toast.error("Company Code, Name & GSTIN are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,15}$/.test(Company_Code)) {
      toast.error("Company Code must be alphanumeric & max 15 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,50}$/.test(Company_Name)) {
      toast.error("Company Name must be alphanumeric & max 50 chars");
      return;
    }
    if (!/^[0-9A-Z]{15}$/.test(GSTIN)) {
      toast.error("GSTIN must be exactly 15 characters (A-Z, 0-9)");
      return;
    }

    addLayout13("com", companyData);
  };

  // Handle success & error
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Company Added Successfully");
      setCompanyData({
        Company_Code: "",
        Company_Name: "",
        GSTIN: "",
        Active: true,
        Address: "",
        Contact: "",
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
            <h5 className="mb-0 text-sm md:text-base">Company Master</h5>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Input Form */}
        <Col xs={12}>
          <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-center">
            <div
              className="table-wrapper me-md-3 mb-2 mb-md-0"
              style={{ overflowX: "auto" }}
            >
              <table className="text-sm">
                <thead className="tab-head">
                  <tr>
                    <th style={{ width: "30px" }}>
                      <i className="bi bi-tag text-xs md:text-sm"></i>
                    </th>
                    <th>Code*</th>
                    <th>Name*</th>
                    <th>GSTIN*</th>
                    <th>Address</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody className="tab-body">
                  <tr>
                    <td>
                      <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                    </td>
                    <td>
                      <input
                        placeholder="Company Code"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        name="Company_Code"
                        value={companyData.Company_Code}
                        onChange={OnChangeHandler}
                        maxLength={15}
                        ref={inputRef}
                        style={{ width: "120px" }}
                      />
                    </td>
                    <td>
                      <input
                        placeholder="Company Name"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        name="Company_Name"
                        value={companyData.Company_Name}
                        onChange={OnChangeHandler}
                        maxLength={50}
                        style={{ width: "200px" }}
                      />
                    </td>
                    <td>
                      <input
                        placeholder="GSTIN"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        name="GSTIN"
                        value={companyData.GSTIN}
                        onChange={OnChangeHandler}
                        maxLength={15}
                        style={{ width: "160px" }}
                      />
                    </td>
                  
                    <td>
                      <input
                        placeholder="Address"
                        className="input-cell text-xs md:text-sm py-1"
                        name="Address"
                        value={companyData.Address}
                        onChange={OnChangeHandler}
                        style={{ width: "220px" }}
                      />
                    </td>
                    <td>
                      <input
                        placeholder="Contact"
                        className="input-cell text-xs md:text-sm py-1"
                        name="Contact"
                        value={companyData.Contact}
                        onChange={OnChangeHandler}
                        style={{ width: "160px" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <Button
                variant="success"
                onClick={() => SaveData()}
                disabled={isDisable}
                className="text-xs md:text-sm py-1"
                size="sm"
              >
                {addIsLoading ? "Please wait..." : "Submit"}
              </Button>
            </div>
          </div>
        </Col>

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
                    placeholder="Search here..."
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
          <Layout13Table
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type={"com"}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Layout13Master;
