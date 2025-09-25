import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import useLayout11Master from "../../Store/MasterStore/useLayout11Master";
import Layout11Table from "./Layout11Table";
import useLayout13Master from "../../Store/MasterStore/useLayout13Master";
import SearchableDropDown from "../../Components/SearchableDropDown";

function Layout11Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  // ✅ State aligned with Django model
  const [systemData, setSystemData] = useState({
    Metal_Type: "P", // Default: Pure
    System_Name: "Default System", // fixed
    Company_Name: "", // hardcoded, will come from auth later
  });

  // ✅ Metal choices
  const metalOptions = [
    { value: "P", label: "Pure" },
    { value: "B", label: "Brass" },
    { value: "A", label: "Alloy" },
    { value: "M", label: "Model" },
    { value: "S", label: "Scrap" },
    { value: "O", label: "Others" },
  ];
  const { layout13, fetchLayout13 } = useLayout13Master();


  const dropdownList = useMemo(() => {
    return layout13.map((item) => ({
      label: `${item.Company_Code}`,
      value: item.Company_ID,
    }));
  }, [layout13]);


    
  const { addIsLoading, addError, addIsSuccess, addLayout11, clearAddState } =
    useLayout11Master();

  useEffect(() => {
      inputRef.current?.focus();
        fetchLayout13("com"); // Load companies on mount
  }, []);

  // Handle change
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setSystemData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save data
  const SaveData = () => {
    const { Metal_Type, System_Name, Company_Name } = systemData;

    if (!Metal_Type) {
      toast.error("Metal Type is mandatory");
      return;
    }
    if (!System_Name) {
      toast.error("System Name is required");
      return;
    }

    addLayout11("sysm", systemData); // ✅ store call
  };

  // Handle success & error
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("System Added Successfully");
      setSystemData({
        Metal_Type: "P",
        System_Name: "Default System",
        Company_Name: "",
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
            <h5 className="mb-0 text-sm md:text-base">Layout11 Master</h5>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Input Section */}
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
                    <th className="text-xs md:text-sm">Metal Type*</th>
                    <th className="text-xs md:text-sm">System Name*</th>
                    <th className="text-xs md:text-sm">Company Code*</th>
                  </tr>
                </thead>
                <tbody className="tab-body">
                  <tr>
                    <td>
                      <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                    </td>
                    <td>
                  
                      <SearchableDropDown
                        options={metalOptions}
                        handleChange={(e) => OnChangeHandler(e)}
                        selectedVal={systemData?.Metal_Type || -1}
                        label={"Metal_Type"}
                        placeholder={"--Select Type--"}
                        width={"100%"}
                        defaultval={-1}
                      />
                    </td>
                    <td>
                      <input
                        className="input-cell text-xs md:text-sm py-1"
                        name="System_Name"
                        value={systemData.System_Name}
                        disabled
                        style={{ width: "200px" }}
                      />
                    </td>
                    <td>
                      <SearchableDropDown
                        options={dropdownList}
                        handleChange={(e) => OnChangeHandler(e)}
                        selectedVal={systemData?.Company_Name || -1}
                        label={"Company_Name"}
                        placeholder={"--Select Type--"}
                        width={"100%"}
                        defaultval={-1}
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
              {/* Textarea */}
              <div className="flex-grow-1" style={{ minWidth: "180px" }}>
                <textarea
                  value={textDetail}
                  readOnly
                  placeholder="Detail View"
                  className="w-100 border border-blue-400 rounded p-2 text-xs md:text-sm focus:outline-none resize-none"
                  rows={2}
                />
              </div>
              {/* Search Bar */}
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

        <Col xs={12}>
          <Layout11Table
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type={"sysm"}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Layout11Master;
