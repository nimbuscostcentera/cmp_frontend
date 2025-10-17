import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../../Components/Table/table.css";

// ✅ Zustand store
import useTab4Master from "../../../Store/OpeningStore/useTab4Master";

// Reusable dropdowns (fetch like layout masters)
import useLayout1Master from "../../../Store/MasterStore/useLayout1Master";
import useLayout2Master from "../../../Store/MasterStore/useLayout2Master";
import SearchableDropDown from "../../../Components/SearchableDropDown";
import Tab4Color from "./Tab4Color";
import useDesignMaster from "../../../Store/MasterStore/useDesignMaster";
import axios from "axios";
import useDesignItemType from "../../../Store/MasterStore/useDesignItemType";
import Tab4Stone from "./Tab4Stone";
import useLayout10Master from "../../../Store/MasterStore/useLayout10Master";
import Tab4MasterTable from "./Tab4MasterTable";

// import Tab4DetailsModel from "./Tab4DetailsModel";
// import Tab4ItemTypeModel from "./Tab4ItemTypeModel";

function Tab4Master() {
  const inputRef = useRef();
    const [isDisable, setIsDisable] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [layoutItem, setLayoutItem] = useState([]);
  const [layoutSize, setLayoutSize] = useState([]);
  const [layoutStoneM, setLayoutStoneM] = useState([]);
  const [layoutStoneS, setLayoutStoneS] = useState([]);
  const [layoutDepartment, setLayoutDepartment] = useState([]);

  const [layoutColor, setLayoutColor] = useState([]);

  // ✅ Zustand store states
  const {
    tab4Data,
    addIsLoading,
    addIsSuccess,
    addError,
    addTab4,
    fetchTab4,
    clearAddState,
  } = useTab4Master();

  // Combo dropdowns from layout masters
  const { layout1, fetchLayout1 } = useLayout1Master(); // Item Master
  const { layout2, fetchLayout2 } = useLayout2Master(); // Department Master & stone master
  const { layout10, fetchLayout10 } = useLayout10Master(); // stone sub master
  const { Design: designData, fetchDesign } = useDesignMaster();
  const { DesignItemType, fetchDesignItemType } = useDesignItemType();

  const [tab4Header, setTab4Header] = useState({
    Department: "",
    Design: "",
    ItemType: "",
    Item: "",
    Color: "",
    Pcs: "",
    GWeight: "",
    Color_Display: "",
    Color_Id: "",
    Weight: "",
    colors: [],
    stones: [],
  });

  // 🧠 Dropdown data mapping
  const departmentOptions = useMemo(
    () => layout2.map((i) => ({ label: i.Code, value: i.ID })),
    [layout2]
  );

  const designOptions = useMemo(
    () => designData.map((i) => ({ label: i.Design_Code, value: i.DesignID })),
    [designData]
  );

  const itemOptions = useMemo(
    () => layoutItem.map((i) => ({ label: i.Code, value: i.ID })),
    [layoutItem]
  );

  const itemtypeOptions = useMemo(
    () =>
      DesignItemType.map((i) => ({
        label: `${i.ItemType_Name}:${i.Approx_Gross_Weight}`,
        value: i.ID,
        Approx_Gross_Weight: i.Approx_Gross_Weight,
      })),
    [DesignItemType]
  );

const sizeOptions = useMemo(
  () => layoutSize.map((i) => ({ label: i.Code, value: i.ID })),
  [layoutSize]
);

const stoneMainOptions = useMemo(
  () => layoutStoneM.map((i) => ({ label: i.Code, value: i.ID })),
  [layoutStoneM]
);

const stoneSubOptions = useMemo(
  () =>
    layoutStoneS.map((item) => ({
      label: `${item.Sub_Code}`,
      value: item.Sub_ID,
      Weight: item.Weight,
    })),
  [layoutStoneS]
);

const colorOptions = useMemo(
  () => layoutColor.map((i) => ({ label: i.Code, value: i.ID })),
  [layoutColor]
);


  useEffect(() => {
    fetchDesign("header");
  async function fetchLayoutData() {
    const resSize = await fetchLayout1("szm");
    setLayoutSize(resSize);
    const resitem = await fetchLayout1("im");
    setLayoutItem(resitem);

    const resStoneM = await fetchLayout2("sm");
    setLayoutStoneM(resStoneM);

    const resStoneS = await fetchLayout10("ssm");
    setLayoutStoneS(resStoneS);

    const resColor = await fetchLayout1("cm");
    setLayoutColor(resColor);

    const resDept = await fetchLayout2("dm");
    setLayoutDepartment(resDept);
  }

  fetchLayoutData();
}, []);

  useEffect(() => {
    if (tab4Header.Design) {
      fetchDesignItemType("itemtype", tab4Header.Design);
    }
  }, [tab4Header.Design]);

  // 🧠 Calculate GWeight whenever Pcs or Weight changes
  useEffect(() => {
    const calculateGWeight = () => {
      const weightPerPiece = parseFloat(tab4Header.Weight) || 0;
      const pieces = parseInt(tab4Header.Pcs) || 0;

      if (weightPerPiece > 0 && pieces > 0) {
        const gWeight = weightPerPiece * pieces;
        setTab4Header((prev) => ({
          ...prev,
          GWeight: gWeight.toFixed(3).toString(),
        }));
      } else {
        setTab4Header((prev) => ({
          ...prev,
          GWeight: "",
        }));
      }
    };

    calculateGWeight();
  }, [tab4Header.Weight, tab4Header.Pcs]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Pcs") {
      const regex = /^[0-9]{0,6}$/;
      if (value !== "" && !regex.test(value)) return;
    }
    setTab4Header((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save handler (no FormData)
  const handleSave = async () => {
    const { Department, Design, ItemType, Item, colors, stones, GWeight, Pcs } = tab4Header;
// console.log(Department,Design, ItemType, Item, colors, stones, GWeight, Pcs);
    if (!Department || !Design || !ItemType || !Item || !colors.length || !stones.length || !GWeight || !Pcs) {
      toast.error("All fields are mandatory");
      return;
    }

    await addTab4("tab4", tab4Header);
  };

  const handleSaveDetails = (rows, colorNames, Color_Id) => {
    setTab4Header((prev) => ({
      ...prev,
      colors: rows,
      Color_Display: colorNames,
      Color_Id: Color_Id,
    }));
  };

  // console.log(tab4Header, "tab4data");
  // ✅ Success/Error feedback
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Tab4 Record Added Successfully!");
      setTab4Header({
        Department: "",
        Design: "",
        ItemType: "",
        Item: "",
        Pcs: "",
        Weight: "",
        GWeight: "",
        Color_Display: "",
        Color_Id: "",
        stones: [],
        colors: [], 
      });
    }
    if (addError) toast.error(addError);
    clearAddState();
  }, [addIsSuccess, addError]);

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <h5 className="mb-2 text-sm md:text-base font-semibold text-gray-700">
            Opening Design Stock (Tab 4)
          </h5>
        </Col>

        <Col xs={12}>
          <div
            className="table-wrapper"
            style={{ overflowX: "auto", marginBottom: "10px" }}
          >
            <table className="text-sm">
              <thead className="tab-head">
                <tr>
                  <th>#</th>
                  <th>Department*</th>
                  <th>Design*</th>
                  <th>Item Type*</th>
                  <th>Item*</th>
                  <th>Pcs*</th>
                  <th>Weight*</th>
                  <th>GWeight*</th>
                  <th>Color Display*</th>
                  <th>Stone D.*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                  </td>
                  <td>
                    <SearchableDropDown
                      options={departmentOptions}
                      handleChange={(e) =>
                        setTab4Header((prev) => ({
                          ...prev,
                          Department: e.target.value,
                        }))
                      }
                      selectedVal={tab4Header.Department || -1}
                      placeholder={"--Select Department--"}
                      width={"100%"}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={designOptions}
                      handleChange={(e) => {
                        const selectedDesign = designData.find(
                          (item) => item.DesignID === e.target.value
                        );
                        console.log(selectedDesign, "selectedDesign");
                        setTab4Header((prev) => ({
                          ...prev,
                          Design: e.target.value,
                          Item: selectedDesign
                            ? selectedDesign.ID_master
                            : null,
                        }));
                      }}
                      selectedVal={tab4Header.Design || -1}
                      placeholder={"--Select Design--"}
                      width={"100%"}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={itemtypeOptions}
                      handleChange={(e) => {
                        const result = itemtypeOptions.find(
                          (item) => item.value === e.target.value
                        )?.Approx_Gross_Weight;
                        setTab4Header((prev) => ({
                          ...prev,
                          ItemType: e.target.value,
                          Weight: result || "",
                        }));
                      }}
                      selectedVal={tab4Header.ItemType || -1}
                      placeholder={"--Select Item Type--"}
                      width={"100%"}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={itemOptions}
                      handleChange={(e) =>
                        setTab4Header((prev) => ({
                          ...prev,
                          Item: e.target.value,
                        }))
                      }
                      selectedVal={tab4Header.Item || -1}
                      placeholder={"--Select Item--"}
                      width={"100%"}
                      disabled={"true"}
                    />
                  </td>
                  <td>
                    <input
                      name="Pcs"
                      type="number"
                      value={tab4Header.Pcs}
                      onChange={handleChange}
                      placeholder="Pcs"
                      className="input-cell text-xs md:text-sm py-1"
                    />
                  </td>
                  <td>
                    <input
                      name="Weight"
                      type="number"
                      value={tab4Header.Weight}
                      onChange={handleChange}
                      placeholder="Auto Come"
                      readOnly
                      className="input-cell text-xs md:text-sm py-1 bg-gray-100"
                    />
                  </td>
                  <td>
                    <input
                      name="GWeight"
                      type="number"
                      value={tab4Header.GWeight}
                      onChange={handleChange}
                      placeholder="Auto Calculated"
                      readOnly
                      className="input-cell text-xs md:text-sm py-1 bg-gray-100"
                    />
                  </td>

                  <td>
                    <div className="d-flex align-items-center">
                      <input
                        name="Color_Display"
                        value={tab4Header.Color_Display}
                        onChange={handleChange}
                        placeholder="Color Display"
                        className="input-cell text-xs md:text-sm py-1"
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
                    <div className="d-flex align-items-center">
                      <input
                        name="StoneD."
                        value={tab4Header.stones.length || ""}
                        onChange={handleChange}
                        placeholder="Stone D."
                        className="input-cell text-xs md:text-sm py-1"
                        readOnly
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModal1(true)}
                      >
                        <i
                          className="bi bi-pencil-square"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>

        <Col
          xs={12}
          className="d-flex justify-content-between align-items-center mb-2"
        >
          <div className="flex-grow" style={{ maxWidth: "250px" }}>
            <div className="d-flex align-items-center border border-blue-400 rounded-md p-1 text-xs md:text-sm">
              <i className="bi bi-search text-gray-400 mx-1"></i>
              <input
                value={searchData}
                type="search"
                placeholder="Search..."
                onChange={(e) => setSearchData(e.target.value)}
                className="w-100 border-0 outline-none bg-transparent px-1"
              />
            </div>
          </div>

          <Button variant="success" onClick={handleSave} size="sm">
            {addIsLoading ? "Please wait..." : "Submit"}
          </Button>
        </Col>

        <Col xs={12}>
          <Tab4MasterTable
            search={searchData}
            // setTextDetail={setTextDetail}
            sizeOptions={sizeOptions}
            stoneMainOptions={stoneMainOptions}
            stoneSubOptions={stoneSubOptions}
            colorOptions={colorOptions}
            departmentOptions={departmentOptions}
            designOptions={designOptions}
            itemOptions={itemOptions}
            itemtypeOptions={itemtypeOptions}
            setIsDisable={setIsDisable}
          />
        </Col>
      </Row>
      {showModal && (
        <Tab4Color
          show={showModal}
          handleClose={() => setShowModal(false)}
          rows={tab4Header.colors}
          setRows={handleSaveDetails}
          colorOptions={colorOptions}
          // Color_Display={tab4Header.Color_Display}
        />
      )}
      {showModal1 && (
        <Tab4Stone
          show={showModal1}
          handleClose={() => setShowModal1(false)}
          rows={tab4Header.stones}
          setRows={(rows) =>
            setTab4Header((prev) => ({ ...prev, stones: rows }))
          }
          sizeOptions={sizeOptions}
          stoneMainOptions={stoneMainOptions}
          stoneSubOptions={stoneSubOptions}
          colorOptions={colorOptions}
        />
      )}

      {/* Modals (commented for reuse) */}
      {/* <Tab4DetailsModel show={showModal} handleClose={() => setShowModal(false)} /> */}
      {/* <Tab4ItemTypeModel show={showModal1} handleClose={() => setShowModal1(false)} /> */}
    </Container>
  );
}

export default Tab4Master;
