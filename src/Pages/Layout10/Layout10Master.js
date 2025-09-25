// pages/Layout10Master/Layout10Master.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import Layout10Table from "./Layout10Table";
import useLayout10Master from "../../Store/MasterStore/useLayout10Master";
import "../../Components/Table/table.css";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";

function Layout10Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [type] = useState("ssm"); // ✅ type for Stone Sub Master

  const [itemData, setItemData] = useState({
    Sub_Code: "",
    Description: "",
    Pcs: 1, // ✅ default 1
    WgtPerPcs: "",
    ID_Group: "",
    Unit: "",
  });

  const {
    addError,
    addIsLoading,
    addIsSuccess,
    addLayout10,
    clearAddState,
    fetchLayout10,
  } = useLayout10Master();

  const { layout2, fetchLayout2 } = useLayout2Master();

  // Load Stone Master list
  useEffect(() => {
    inputRef.current?.focus();
    fetchLayout2("sm"); // ✅ fetch stone master
  }, []);

  // When user selects Stone Master, auto set ID_Group + Unit
  const handleStoneMasterSelect = (stone) => {
    setItemData((prev) => ({
      ...prev,
      ID_Group: stone.ID,
      Unit: stone.Unit_Code || "", // ✅ show unit if available from API
    }));
  };

  // Handle input change
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "WgtPerPcs" && value !== "") {
      const regex = /^\d{1,6}\.?\d{0,3}$/; // up to 3 decimal places and before . 6 place can be filled
      if (!regex.test(value)) {
        return;
      }
    }
      setItemData((prev) => ({ ...prev, [name]: value }));
  };

  // Save item
  const SaveData = () => {
    const { Sub_Code, Description, Pcs, WgtPerPcs, ID_Group } = itemData;

    if (!Sub_Code || !Description || !Pcs || !WgtPerPcs || !ID_Group) {
      toast.error("All fields are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Sub_Code)) {
      toast.error("Sub Code must be max 6 alphanumeric");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description must be max 15 alphanumeric");
      return;
    }
    if (isNaN(WgtPerPcs) || parseFloat(WgtPerPcs) <= 0) {
      toast.error("Weight/Pcs must be a valid decimal");
      return;
    }

    addLayout10(type, {
      Sub_Code,
      Description,
      Pcs,
      WgtPerPcs,
      ID_Group,
      Unit: itemData.Unit,
    });
  };

  // Handle Add success/error
  useEffect(() => {
    if (addIsSuccess) {
      toast.success("Stone Sub Master Added Successfully");
      setItemData({
        Sub_Code: "",
        Description: "",
        Pcs: 1,
        WgtPerPcs: "",
        ID_Group: "",
        Unit: "",
      });
      fetchLayout10(type); // ✅ refresh table after add
    }
    if (addError) {
      toast.error(addError);
    }
    clearAddState();
  }, [addIsSuccess, addError, clearAddState, fetchLayout10, type]);

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <div className="d-flex align-items-center">
            <h5 className="mb-0 text-sm md:text-base">Stone Sub Master</h5>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Input Section */}
        <Col xs={12}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 md:gap-4">
            <div className="overflow-x-auto">
              <table className="text-sm min-w-[700px]">
                <thead className="tab-head">
                  <tr>
                    <th></th>
                    <th>Sub Code*</th>
                    <th>Description*</th>
                    <th>Pcs*</th>
                    <th>Weight/Pcs*</th>
                    <th>Stone Group*</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody className="tab-body">
                  <tr>
                    <td>
                      <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                    </td>
                    <td>
                      <input
                        placeholder="Enter Sub Code"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        name="Sub_Code"
                        value={itemData?.Sub_Code || ""}
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
                        style={{ width: "150px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        name="Pcs"
                        value={itemData?.Pcs}
                        readOnly // ✅ not editable
                        style={{ width: "60px", backgroundColor: "#f3f3f3" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.001"
                        placeholder="Weight/Pcs"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        name="WgtPerPcs"
                        value={itemData?.WgtPerPcs || ""}
                        onChange={OnChangeHandler}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      <select
                        className="input-cell form-input text-xs md:text-sm py-1"
                        value={itemData?.ID_Group || ""}
                        onChange={(e) => {
                          const stone = layout2.find(
                            (s) => s.ID === parseInt(e.target.value)
                          );
                          if (stone) handleStoneMasterSelect(stone);
                        }}
                        style={{ width: "150px" }}
                      >
                        <option value="">--Select Stone--</option>
                        {layout2.map((stone) => (
                          <option key={stone.ID} value={stone.ID}>
                            {stone.Code}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-cell form-input text-xs md:text-sm py-1"
                        value={itemData?.Unit || ""}
                        readOnly
                        style={{ width: "80px", backgroundColor: "#f3f3f3" }}
                      />
                    </td>
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
        </Col>

        {/* Table */}
        <Col xs={12}>
          <Layout10Table
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

export default Layout10Master;
