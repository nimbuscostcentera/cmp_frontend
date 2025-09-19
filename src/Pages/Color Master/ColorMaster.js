// pages/ColorMaster/ColorMaster.js
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import ColorTable from "./ColorTable";
import useColorMaster from "../../Store/AddStore/useAddColorMaster";
import "../../Components/Table/table.css";

function ColorMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  const [colorData, setColorData] = useState({
    CODE: "",
    DESCRIPTION: "",
  });

  const {
    addError,
    addIsLoading,
    addIsSuccess,
    addColor,
    clearAddState,
    fetchColors,
  } = useColorMaster();

  useEffect(() => {
    inputRef.current?.focus();
    fetchColors(); // Load colors on mount
  }, []);

  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setColorData((prev) => ({ ...prev, [name]: value }));
  };

  const SaveData = () => {
    const { CODE, DESCRIPTION } = colorData;
    if (!CODE || !DESCRIPTION) {
      toast.error("Fill The Mandatory Fields");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(CODE)) {
      toast.error("Code must be max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(DESCRIPTION)) {
      toast.error("Description must be max 15 chars");
      return;
    }
    addColor({ Color_Code: CODE, Description: DESCRIPTION });
  };

  // ✅ Handle Add state changes
  useEffect(() => {
    if (addIsSuccess) {
      toast.success("Color Added Successfully");
      fetchColors();
      setColorData({ CODE: "", DESCRIPTION: "" });
    }
    if (addError) {
      toast.error(addError);
    }
    clearAddState();
  }, [addIsSuccess, addError]);

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className=" w-100">
        <Col xs={12}>
          <div className="d-flex align-items-center">
            <h5 className="mb-0 text-sm md:text-base">Color Master</h5>
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
                        value={colorData?.CODE || ""}
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
                        value={colorData?.DESCRIPTION || ""}
                        onChange={OnChangeHandler}
                        maxLength={15}
                        style={{ width: "180px" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <Button
                variant="success"
                onClick={SaveData}
                disabled={isDisable || addIsLoading}
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

        {/* Table */}
        <Col xs={12}>
          <ColorTable
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

export default ColorMaster;
