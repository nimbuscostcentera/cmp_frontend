import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import PlatingPolishTable from "./PlatingPolishTable";
import useAddColorMaster from "../../Store/AddStore/useAddColorMaster";

function PlatingPolishMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  const [platingData, setPlatingData] = useState({
    CODE: "",
    DESCRIPTION: "",
    RATE_GM: "",
  });

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
    setPlatingData((prev) => ({ ...prev, [name]: value }));
  };

  const SaveData = () => {
    const { CODE, DESCRIPTION, RATE_GM } = platingData;

    // Mandatory check
    if (!CODE || !DESCRIPTION || !RATE_GM) {
      toast.error("All fields are mandatory");
      return;
    }

    // Code validation
    if (!/^[a-zA-Z0-9]{1,6}$/.test(CODE)) {
      toast.error("Code must be alphanumeric & max 6 chars");
      return;
    }

    // Description validation
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(DESCRIPTION)) {
      toast.error("Description must be alphanumeric & max 15 chars");
      return;
    }

    // Rate/Gm validation
    const rate = parseFloat(RATE_GM);
    if (isNaN(rate)) {
      toast.error("Rate/Gm must be a number");
      return;
    }

    ColorMasterAdd(platingData);
  };

  useEffect(() => {
    if (ColorMasterSuccess && !isColorMasterLoading && !ColorMasterError) {
      toast.success("Plating Polish Added Successfully");
      setPlatingData({
        CODE: "",
        DESCRIPTION: "",
        RATE_GM: "",
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
            <h5 className="mb-0 text-sm md:text-base">Plating Polish Master</h5>
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
                    <th className="text-xs md:text-sm">Code*</th>
                    <th className="text-xs md:text-sm">Description*</th>
                    <th className="text-xs md:text-sm">Rate/Gm*</th>
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
                        name="CODE"
                        value={platingData?.CODE || ""}
                        onChange={OnChangeHandler}
                        maxLength={6}
                        ref={inputRef}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      <input
                        placeholder="Enter Description"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        name="DESCRIPTION"
                        value={platingData?.DESCRIPTION || ""}
                        onChange={OnChangeHandler}
                        maxLength={15}
                        style={{ width: "180px" }}
                      />
                    </td>
                    <td>
                      <input
                        placeholder="Enter Rate/Gm"
                        className="input-cell text-xs md:text-sm py-1"
                        name="RATE_GM"
                        value={platingData?.RATE_GM}
                        onChange={OnChangeHandler}
                        style={{ width: "140px" }}
                        type="number"
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
                {isColorMasterLoading ? "Please wait..." : "Submit"}
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
          <PlatingPolishTable
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

export default PlatingPolishMaster;
