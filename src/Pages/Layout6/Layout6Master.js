import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import useLayout6Master from "../../Store/MasterStore/useLayout6Master";
import useLayout11Master from "../../Store/MasterStore/useLayout11Master";
import Layout6Table from "./Layout6Table";
import SearchableDropDown from "../../Components/SearchableDropDown";

function Layout6Master() {
    const inputRef = useRef();
    const [searchData, setSearchData] = useState("");
    const [isDisable, setIsDisable] = useState(false);
    const [textDetail, setTextDetail] = useState("");

    // ✅ State aligned with RawMaterialMaster
    const [rawData, setRawData] = useState({
        Raw_Code: "",
        Raw_Description: "",
        Tolerance_Lower: "",
        Tolerance_Upper: "",
        Metal_Type: "", // FK to SystemMaster
    });
    const metalOptions = {
        "P": "Pure",
        "B": "Brass",
        "A": "Alloy",
        "M": "Model",
        "S": "Scrap",
        "O": "Others",
   
}
  // Fetch SystemMaster for dropdown
  const { layout11, fetchLayout11 } = useLayout11Master();

  const systemDropdown = useMemo(() => {
    return layout11?.map((item) => ({
      label: metalOptions[item.Metal_Type],
      value: item.id,
    }));
  }, [layout11]);

  const { addIsLoading, addError, addIsSuccess, addLayout6, clearAddState } =
    useLayout6Master();

  useEffect(() => {
    inputRef.current?.focus();
    fetchLayout11("sysm"); // Load SystemMaster on mount
  }, []);

  // Handle change
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setRawData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save data
  const SaveData = () => {
    const { Raw_Code, Raw_Description, Metal_Type } = rawData;

    if (!Raw_Code) {
      toast.error("Raw Code is mandatory");
      return;
    }
    if (!Raw_Description) {
      toast.error("Raw Description is required");
      return;
    }
    if (!Metal_Type) {
      toast.error("Metal Type is required");
      return;
    }

    addLayout6("rmm", rawData); // ✅ store call
  };

  // Handle success & error
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Raw Material Added Successfully");
      setRawData({
        Raw_Code: "",
        Raw_Description: "",
        Tolerance_Lower: "",
        Tolerance_Upper: "",
        Metal_Type: "",
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
            <h5 className="mb-0 text-sm md:text-base">Raw Material Master</h5>
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
                    <th>Raw Code*</th>
                    <th>Raw Description*</th>
                    <th>Tolerance Lower</th>
                    <th>Tolerance Upper</th>
                    <th>System*</th>
                  </tr>
                </thead>
                <tbody className="tab-body">
                  <tr>
                    <td>
                      <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                    </td>
                    <td>
                      <input
                        placeholder="Enter Raw Code"
                        ref={inputRef}
                        className="input-cell text-xs md:text-sm py-1"
                        name="Raw_Code"
                        value={rawData.Raw_Code}
                        onChange={OnChangeHandler}
                        maxLength={6}
                      />
                    </td>
                    <td>
                      <input
                        placeholder="Enter Raw Description"
                        className="input-cell text-xs md:text-sm py-1"
                        name="Raw_Description"
                        value={rawData.Raw_Description}
                        onChange={OnChangeHandler}
                        maxLength={15}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input-cell text-xs md:text-sm py-1"
                        name="Tolerance_Lower"
                        value={rawData.Tolerance_Lower}
                        onChange={OnChangeHandler}
                        placeholder="Tolerance Lower"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input-cell text-xs md:text-sm py-1"
                        name="Tolerance_Upper"
                        value={rawData.Tolerance_Upper}
                        onChange={OnChangeHandler}
                        placeholder="Tolerance Upper"
                      />
                    </td>
                    <td>
                      <SearchableDropDown
                        options={systemDropdown}
                        handleChange={(e) => OnChangeHandler(e)}
                        selectedVal={rawData?.Metal_Type || -1}
                        label={"Metal_Type"}
                        placeholder={"--Select System--"}
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
            <div className="flex-grow-1" style={{ minWidth: "180px" }}>
              <textarea
                value={textDetail}
                readOnly
                placeholder="Detail View"
                className="w-100 border border-blue-400 rounded p-2 text-xs md:text-sm resize-none"
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
        </Col>

        <Col xs={12}>
          <Layout6Table
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type={"rmm"}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Layout6Master;
