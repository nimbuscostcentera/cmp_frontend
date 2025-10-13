import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import useSpcpMaster from "../../Store/MasterStore/useSpcpMaster";
import Layout13Table from "../Layout13/Layout13Table";
import StoneDetailsModal from "./StoneDetailsModal";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";
import useLayout10Master from "../../Store/MasterStore/useLayout10Master";
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";
import SearchableDropDown from "../../Components/SearchableDropDown";
import SpcpMasterTable from "./SpcpMasterTable";


function StoneRateMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [colorList, setColorList] = useState([]);
  const [mischargeList , setMischargeList] = useState([]);

  // ✅ single object state (not array)
  const [stoneRateHeaders, setStoneRateHeaders] = useState({
    type: "header",
    ID_StoneM: null,
    Srl_Col: 1,
    ID_StoneS: null,
    ID_Color: null,
    Pcs: "",
    Weight: "",
    CP: "",
    SP: "",
    totalcharge: "",
    Details: [],
  });

  const { addIsLoading, addError, addIsSuccess, addSpcp, clearAddState } =
    useSpcpMaster();

  const { layout2, fetchLayout2 } = useLayout2Master(); // Stone Master
  const { layout10, fetchLayout10 } = useLayout10Master(); // Stone Sub Master
  const {  fetchLayout1 } = useLayout1Master(); // Color

  const dropdownListStoneS = useMemo(
    () =>
      layout10.map((item) => ({
        label: `${item.Sub_Code}`,
        value: item.Sub_ID,
        Standard_Weight: item.Weight,
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
      colorList.map((item) => ({
        label: `${item.Code}`,
        value: item.ID,
      })),
    [colorList]
  );
  const dropdownListMiscCharge = useMemo(
    () =>
      mischargeList.map((item) => ({
        label: `${item.Code}: ${item.Description}`,
        value: item.ID,
      })),
    [mischargeList]
  );



  useEffect(() => {
    inputRef.current?.focus();
    fetchLayout10("ssm");
    fetchLayout2("sm");

       async function fetchLayout() {
         const res = await fetchLayout1("cm");
         //    console.log(res,"res")
         setColorList(res);

         const res1 = await fetchLayout1("mm");
         //    console.log(res1,"res1")
         setMischargeList(res1);
       }
       fetchLayout();
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
    setStoneRateHeaders((prev) => ({
      ...prev,
      SP: sp.toFixed(2),
      totalcharge: miscTotal.toFixed(2),
    }));
  }, [stoneRateHeaders.CP, stoneRateHeaders.Details]);

  // Save new record
  const SaveData = () => {
    const { ID_StoneM, Srl_Col, ID_StoneS, ID_Color } = stoneRateHeaders;
    console.log(stoneRateHeaders, "stoneRateHeaders");
    if (!ID_StoneM || !Srl_Col || !ID_StoneS || !ID_Color) {
      toast.error("Stone Master, Srl Col, Stone Sub, and Color are mandatory");
      return;
    }

    console.log(stoneRateHeaders, "🚀 Final Payload (header + details)");
    addSpcp("stoneRate", stoneRateHeaders);
  };

  // Handle success & error
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Stone Rate Setting Added Successfully");
    setStoneRateHeaders({
      type: "header",
      ID_StoneM: null,
      Srl_Col: 1,
      ID_StoneS: null,
      ID_Color: null,
      Pcs: "",
      Weight: "",
      CP: "",
      SP: "",
      totalcharge: "",
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
                  <th className="w-[30px]">
                    <i className="bi bi-tag text-xs md:text-sm"></i>
                  </th>
                  <th>Stone Master*</th>
                  <th>Stone Sub*</th>
                  <th>Color*</th>
                  <th>Pcs</th>
                  <th>Weight</th>
                  <th>CP</th>
                  <th style={{ width: "180px" }}>Mis. Charge</th>
                  <th>SP (Auto)</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                  </td>
                  <td>
                    <SearchableDropDown
                      options={dropdownListStoneM}
                      handleChange={(e) => {
                        const id = e.target.value;

                        setStoneRateHeaders((prev) => ({
                          ...prev,
                          ID_StoneM: id,
                        }));
                      }}
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
                      handleChange={(e) => {
                        const id = e.target.value;
                        const stone_weight = layout10.find(
                          (stone) => stone.Sub_ID === id
                        )?.Weight;
                        console.log(stone_weight, "💠 Stone Weight from SSM");
                        setStoneRateHeaders((prev) => ({
                          ...prev,
                          Weight: stone_weight,
                          ID_StoneS: e.target.value,
                        }));
                      }}
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
                      readOnly
                      style={{ width: "100px", background: "#f3f3f3" }}
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
                    <div className="d-flex align-items-center">
                      <input
                        placeholder="Principal Amount"
                        className="input-cell"
                        name="principalAmount"
                        value={stoneRateHeaders.totalcharge}
                        type="number"
                        step="0.01"
                        style={{ width: "100%" }}
                        readOnly
                      />

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModal(true)}
                      >
                        <i
                          className="bi bi-pencil-square"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </Button>
                    </div>
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
          <SpcpMasterTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type={"header"}
            dropdownListStoneS={dropdownListStoneS}
            dropdownListStoneM={dropdownListStoneM}
            dropdownListColor={dropdownListColor}
            dropdownListMiscCharge={dropdownListMiscCharge}
          />
        </Col>
      </Row>

      {/* ✅ Details Modal */}
      {showModal && (
        <StoneDetailsModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          totalcharge={stoneRateHeaders.totalcharge}
          rows={stoneRateHeaders.Details}
          setRows={handleSaveDetails}
          mischargelist={mischargeList}
        />
      )}
    </Container>
  );
}

export default StoneRateMaster;

