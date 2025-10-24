// pages/Layout1Master/Layout1Master.js
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import Layout1Table from "./Layout1Table"; // replace ColorTable with generic table
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";
import "../../Components/Table/table.css";
import masterMapping from "../../Utils/mastermapping";
 
function Layout1Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [type, setType] = useState("dgm"); // Color, MiscCharge, DesignGroup, Item, Size, Plating

  const [itemData, setItemData] = useState({
    Code: "",
    Description: "",
    Size: false,
  });
 
  const { addError, addIsLoading, addIsSuccess, addLayout1, clearAddState } =
    useLayout1Master();
 
  // Fetch data on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [type]);
 
  // Handle input changes
  const OnChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 
  // Save new item
  const SaveData = () => {
    const { Code, Description } = itemData;
    if (!Code || !Description) {
      toast.error("Fill the mandatory fields");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Code)) {
      toast.error("Code must be max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description must be max 15 chars");
      return;
    }
 
    addLayout1(type, { Code, Description });
  };
 
  // Handle Add state changes
  useEffect(() => {
    if (addIsSuccess) {
      toast.success(
        `Data Added Successfully`
      );
      setItemData({ Code: "", Description: "" });
    }
    if (addError) {
      toast.error(addError);
    }
    clearAddState();
  }, [addIsSuccess, addError]);
 
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
 
        {/* Input Section */}
        <Col xs={12}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 md:gap-4">
            <div className="overflow-x-auto">
              <table className="text-sm min-w-[300px]">
                <thead className="tab-head">
                  <tr>
                    <th className="w-[30px]">
                      <i className="bi bi-tag text-xs md:text-sm"></i>
                    </th>
                    <th className="text-xs md:text-sm">Code*</th>
                    <th className="text-xs md:text-sm">Description*</th>
                    {type === "im" && (
                      <th
                        className="text-xs md:text-sm"
                        style={{ width: "100px" }}
                      >
                        Size
                      </th>
                    )}
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
                        value={itemData?.Code || ""}
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
                        name="Description"
                        value={itemData?.Description || ""}
                        onChange={OnChangeHandler}
                        maxLength={15}
                        style={{ width: "180px" }}
                      />
                    </td>
                    {type === "im" && (
                      <td>
                        <input
                          type="checkbox"
                          name="size"
                          checked={itemData?.size || false}
                          onChange={OnChangeHandler}
                        />
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
 
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
        </Col>
 
        {/* Textarea & Search */}
        <Col xs={12} className="my-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-grow w-full">
              <textarea
                value={textDetail}
                readOnly
                placeholder="Detail View"
                className="w-full border border-blue-400 rounded p-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none min-w-[180px]"
                rows={2}
              />
 
              <div className="flex-grow" style={{ minWidth: "180px" }}>
                <div className="flex items-center border border-blue-400 rounded-md p-1 text-xs md:text-sm focus-within:ring-1 focus-within:ring-blue-300">
                  <i className="bi bi-search text-gray-400 mx-1"></i>
                  <input
                    value={searchData}
                    type="search"
                    placeholder="Search here..."
                    onChange={(e) => setSearchData(e.target.value)}
                    className="w-full border-0 outline-none bg-transparent px-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
 
        {/* Table */}
        <Col xs={12}>
          <Layout1Table
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
 
export default Layout1Master;
 
 