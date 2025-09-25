import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import useLayout13Master from "../../Store/MasterStore/useLayout13Master";
import Layout13Table from "../Layout13/Layout13Table";
import StoneDetailsModal from "./StoneDetailsModal";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";
import useLayout10Master from "../../Store/MasterStore/useLayout10Master";
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";
import SearchableDropDown from "../../Components/SearchableDropDown";

function StoneRateMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ single object state (not array)
  const [stoneRateHeaders, setStoneRateHeaders] = useState({
    ID_StoneM: "",
    Srl_Col: "",
    ID_StoneS: "",
    ID_Color: "",
    Pcs: "",
    Weight: "",
    Tol_Lower: "", // new field
    Tol_Upper: "", // new field
    CP: "",
    SP: "",
    Details: [], // sub grid (Stone_Rate_Setting_MiscChrg)
  });

  const { addIsLoading, addError, addIsSuccess, addLayout13, clearAddState } =
    useLayout13Master();

  const { layout2, fetchLayout2 } = useLayout2Master(); // Stone Master
  const { layout10, fetchLayout10 } = useLayout10Master(); // Stone Sub Master
  const { layout1, fetchLayout1 } = useLayout1Master(); // Color

  const dropdownListStoneS = useMemo(
    () =>
      layout10.map((item) => ({
        label: `${item.Sub_Code}`,
        value: item.Sub_ID,
      })),
    [layout10]
  );

  const dropdownListStoneM = useMemo(
    () =>
      layout2.map((item) => ({
        label: `${item.Code}`,
        value: item.ID,
      })),
    [layout2]
  );

  const dropdownListColor = useMemo(
    () =>
      layout1.map((item) => ({
        label: `${item.Code}`,
        value: item.ID,
      })),
    [layout1]
  );

  useEffect(() => {
    inputRef.current?.focus();
    fetchLayout10("ssm");
    fetchLayout2("sm");
    fetchLayout1("cm");
  }, []);

  // Handle input changes
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setStoneRateHeaders((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate SP = CP + Σ(Misc Charges)
  useEffect(() => {
    const cp = parseFloat(stoneRateHeaders.CP || 0);
    const miscTotal = stoneRateHeaders.Details.reduce(
      (acc, row) => acc + parseFloat(row.Amount || 0),
      0
    );
    const sp = cp + miscTotal;
    setStoneRateHeaders((prev) => ({ ...prev, SP: sp.toFixed(2) }));
  }, [stoneRateHeaders.CP, stoneRateHeaders.Details]);

  // Save new record
  const SaveData = () => {
    const { ID_StoneM, Srl_Col, ID_StoneS, ID_Color } = stoneRateHeaders;
    if (!ID_StoneM || !Srl_Col || !ID_StoneS || !ID_Color) {
      toast.error("Stone Master, Srl Col, Stone Sub, and Color are mandatory");
      return;
    }

    console.log(stoneRateHeaders, "🚀 Final Payload (header + details)");
    addLayout13("stoneRate", stoneRateHeaders);
  };

  // Handle success & error
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Stone Rate Setting Added Successfully");
      setStoneRateHeaders({
        ID_StoneM: "",
        Srl_Col: "",
        ID_StoneS: "",
        ID_Color: "",
        Pcs: "",
        Weight: "",
        Tol_Lower: "",
        Tol_Upper: "",
        CP: "",
        SP: "",
        Details: [],
      });
    }
    if (addError && !addIsLoading && !addIsSuccess) {
      toast.error(addError);
    }
    clearAddState();
  }, [addIsLoading, addIsSuccess, addError]);

  // Save details from modal into header
  const handleSaveDetails = (rows) => {
    setStoneRateHeaders((prev) => ({
      ...prev,
      Details: rows,
    }));
  };

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <h5 className="mb-0 text-sm md:text-base">Stone Rate Setting</h5>
          <hr className="my-1" />
        </Col>

        {/* ✅ Header Table */}
        <Col xs={12}>
          <div
            className="table-wrapper"
            style={{ overflowX: "auto", marginBottom: "10px" }}
          >
            <table className="text-sm">
              <thead className="tab-head">
                <tr>
                  <th>Srl*</th>
                  <th>Stone Master*</th>
                  <th>Stone Sub*</th>
                  <th>Color*</th>
                  <th>Pcs</th>
                  <th>Weight</th>
                  <th>Tol Lower*</th>
                  <th>Tol Upper*</th>
                  <th>CP</th>
                  <th>SP (Auto)</th>
                  <th style={{ width: "100px" }}>Stone Details</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <input
                      placeholder="Srl"
                      className="input-cell text-xs md:text-sm py-1"
                      name="Srl_Col"
                      value={stoneRateHeaders.Srl_Col}
                      onChange={OnChangeHandler}
                      style={{ width: "70px" }}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={dropdownListStoneM}
                      handleChange={(e) =>
                        setStoneRateHeaders((prev) => ({
                          ...prev,
                          ID_StoneM: e.target.value,
                        }))
                      }
                      selectedVal={stoneRateHeaders.ID_StoneM || -1}
                      label={"ID_StoneM"}
                      placeholder={"--Select Stone M--"}
                      width={"100%"}
                      defaultval={-1}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={dropdownListStoneS}
                      handleChange={(e) =>
                        setStoneRateHeaders((prev) => ({
                          ...prev,
                          
                          ID_StoneS: e.target.value,
                        }))
                      }
                      selectedVal={stoneRateHeaders.ID_StoneS || -1}
                      label={"ID_StoneS"}
                      placeholder={"--Select Stone Sub M--"}
                      width={"100%"}
                      defaultval={-1}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={dropdownListColor}
                      handleChange={(e) =>
                        setStoneRateHeaders((prev) => ({
                          ...prev,
                          ID_Color: e.target.value,
                        }))
                      }
                      selectedVal={stoneRateHeaders.ID_Color || -1}
                      label={"ID_Color"}
                      placeholder={"--Select Color--"}
                      width={"100%"}
                      defaultval={-1}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Pcs"
                      className="input-cell text-xs md:text-sm py-1"
                      name="Pcs"
                      value={stoneRateHeaders.Pcs}
                      onChange={OnChangeHandler}
                      style={{ width: "70px" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Weight"
                      className="input-cell text-xs md:text-sm py-1"
                      name="Weight"
                      value={stoneRateHeaders.Weight}
                      onChange={OnChangeHandler}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Tol Lower"
                      className="input-cell text-xs md:text-sm py-1"
                      name="Tol_Lower"
                      value={stoneRateHeaders.Tol_Lower}
                      onChange={OnChangeHandler}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Tol Upper"
                      className="input-cell text-xs md:text-sm py-1"
                      name="Tol_Upper"
                      value={stoneRateHeaders.Tol_Upper}
                      onChange={OnChangeHandler}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="CP"
                      className="input-cell text-xs md:text-sm py-1"
                      name="CP"
                      value={stoneRateHeaders.CP}
                      onChange={OnChangeHandler}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="SP"
                      className="input-cell text-xs md:text-sm py-1"
                      name="SP"
                      value={stoneRateHeaders.SP}
                      readOnly
                      style={{ width: "100px", background: "#f3f3f3" }}
                    />
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowModal(true)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <Button
              variant="success"
              onClick={SaveData}
              disabled={isDisable}
              className="text-xs md:text-sm py-1"
              size="sm"
            >
              {addIsLoading ? "Please wait..." : "Submit"}
            </Button>
          </div>
        </Col>

        {/* ✅ Master Table */}
        <Col xs={12}>
          <Layout13Table
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type={"stoneRate"}
          />
        </Col>
      </Row>

      {/* ✅ Details Modal */}
      {showModal && (
        <StoneDetailsModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          headerId={stoneRateHeaders.ID_StoneM}
          rows={stoneRateHeaders.Details}
          setRows={handleSaveDetails}
        />
      )}
    </Container>
  );
}

export default StoneRateMaster;
