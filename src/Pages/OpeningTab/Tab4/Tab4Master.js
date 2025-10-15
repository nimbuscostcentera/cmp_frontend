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

// import Tab4DetailsModel from "./Tab4DetailsModel";
// import Tab4ItemTypeModel from "./Tab4ItemTypeModel";

function Tab4Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [layoutItem, setLayoutItem] = useState([]);
  const [layoutItemtype, setLayoutItemtype] = useState([]);
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
  const { layout2, fetchLayout2 } = useLayout2Master(); // Department Master
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

  const colorOptions = useMemo(
    () => layoutColor.map((i) => ({ label: i.Code, value: i.ID })),
    [layoutColor]
  );

  useEffect(() => {
    // inputRef.current?.focus();
    fetchDesign("header"); // Fetch Item Master
    fetchLayout2("dm"); // Fetch Department Master

    async function fetchLayout() {
      const res = await fetchLayout1("im");
      setLayoutItem(res);

      const res2 = await fetchLayout1("cm");
      setLayoutColor(res2);
    }
    fetchLayout();
  }, [tab4Data.Design]);

  useEffect(() => {
    if (tab4Header.Design) {
      fetchDesignItemType("itemtype", tab4Header.Design);
    }
  }, [tab4Header.Design]);

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
    const { Department, Design, ItemType, Item, Color, Pcs } = tab4Header;

    if (!Department || !Design || !ItemType || !Item || !Color || !Pcs) {
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


  console.log(tab4Header, "tab4data");
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
                      handleChange={(e) =>
                        setTab4Header((prev) => ({
                          ...prev,
                          Design: e.target.value,
                        }))
                      }
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
          {/* Reusable table */}
          {/* <Tab4MasterTable search={searchData} /> */}
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

      {/* Modals (commented for reuse) */}
      {/* <Tab4DetailsModel show={showModal} handleClose={() => setShowModal(false)} /> */}
      {/* <Tab4ItemTypeModel show={showModal1} handleClose={() => setShowModal1(false)} /> */}
    </Container>
  );
}

export default Tab4Master;
