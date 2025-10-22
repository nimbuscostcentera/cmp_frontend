import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../../Components/Table/table.css";

import useTab4Master from "../../../Store/OpeningStore/useTab4Master";
import useLayout1Master from "../../../Store/MasterStore/useLayout1Master";
import useLayout2Master from "../../../Store/MasterStore/useLayout2Master";
import useLayout10Master from "../../../Store/MasterStore/useLayout10Master";
import useDesignMaster from "../../../Store/MasterStore/useDesignMaster";
import useDesignItemType from "../../../Store/MasterStore/useDesignItemType";

import SearchableDropDown from "../../../Components/SearchableDropDown";
import Tab4Color from "./Tab4Color";
import Tab4Stone from "./Tab4Stone";
import Tab4MasterTable from "./Tab4MasterTable";

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

  // Zustand store
  const { addIsLoading, addIsSuccess, addError, addTab4, clearAddState } =
    useTab4Master();

  // Layout fetch hooks
  const { layout1, fetchLayout1 } = useLayout1Master();
  const { layout2, fetchLayout2 } = useLayout2Master();
  const { layout10, fetchLayout10 } = useLayout10Master();
  const { Design: designData, fetchDesign } = useDesignMaster();
  const { DesignItemType, fetchDesignItemType } = useDesignItemType();

  // Header state (mapped to OpeningDesignStock model)
  const [tab4Header, setTab4Header] = useState({
    ID_Department: "",
    ID_Design: "",
    ID_ItemType: "",
    ID_Item: "",
    ID_Size: "",
    ID_Color: "",
    Pcs: "",
    GWeight: "",
    ColorS: "",
    colors: [],
    stones: [],
    Weight: "",
  });

  // Dropdown data mapping
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

  // Fetch layout data
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

  // Fetch design item type on design change
  useEffect(() => {
    if (tab4Header.ID_Design) {
      fetchDesignItemType("itemtype", tab4Header.ID_Design);
    }
  }, [tab4Header.ID_Design]);

  // Calculate GWeight automatically
  useEffect(() => {
    const weightPerPiece = parseFloat(tab4Header.Weight) || 0;
    const pieces = parseInt(tab4Header.Pcs) || 0;
    const gWeight = weightPerPiece * pieces;
    setTab4Header((prev) => ({
      ...prev,
      GWeight: gWeight > 0 ? gWeight.toFixed(3).toString() : "",
    }));
  }, [tab4Header.Weight, tab4Header.Pcs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Pcs") {
      const regex = /^[0-9]{0,6}$/;
      if (value !== "" && !regex.test(value)) return;
    }
    setTab4Header((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validation logic aligned with OpeningDesignStock
  const handleSave = async () => {
    const {
      ID_Department,
      ID_Design,
      ID_ItemType,
      ID_Item,
      ID_Color,
      Pcs,
      GWeight,
      colors,
      stones,
    } = tab4Header;

    // Basic required validation
    if (
      !ID_Department ||
      !ID_Design ||
      !ID_ItemType ||
      !ID_Item ||
      !ID_Color ||
      !Pcs ||
      !GWeight ||
      !colors.length ||
      !stones.length
    ) {
      toast.error("All fields are mandatory before saving.");
      return;
    }

    // Conditional row validation for stones
    // const invalidStoneRow = stones.find((row) => {
    //   if (row.ID_StoneM && row.ID_StoneS) {
    //     // All except size must be filled
    //     return (
    //       !row.ID_Department ||
    //       !row.ID_Design ||
    //       !row.ID_ItemType ||
    //       !row.ID_Item ||
    //       !row.Pcs
    //     );
    //   }
    //   return false;
    // });

    // if (invalidStoneRow) {
    //   toast.error(
    //     "If Stone Master & Sub are filled, all fields (except Size) must be filled."
    //   );
    //   return;
    // }

    await addTab4("design_header", tab4Header);
  };

  const handleSaveDetails = (rows, colorNames, Color_Id) => {
    setTab4Header((prev) => ({
      ...prev,
      colors: rows,
      ID_Color: colorNames,
      ColorS: Color_Id,
    }));
  };

  // Success/Error feedback
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Tab4 Record Added Successfully!");
      setTab4Header({
        ID_Department: "",
        ID_Design: "",
        ID_ItemType: "",
        ID_Item: "",
        ID_Size: "",
        ID_Color: "",
        Pcs: "",
        GWeight: "",
        ColorS: "",
        colors: [],
        stones: [],
        Weight: "",
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

        {/* Header Table */}
        <Col xs={12}>
          <div className="table-wrapper" style={{ overflowX: "auto" }}>
            <table className="text-sm">
              <thead className="tab-head">
                <tr>
                  <th>#</th>
                  <th>Department*</th>
                  <th>Design*</th>
                  <th>Item Type*</th>
                  <th>Item*</th>
                  <th>Size*</th>
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
                        setTab4Header((p) => ({
                          ...p,
                          ID_Department: e.target.value,
                        }))
                      }
                      selectedVal={tab4Header.ID_Department || -1}
                      placeholder="--Select Department--"
                      width="100%"
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={designOptions}
                      handleChange={(e) => {
                        const selected = designData.find(
                          (item) => item.DesignID === e.target.value
                        );
                        setTab4Header((p) => ({
                          ...p,
                          ID_Design: e.target.value,
                          ID_Item: selected ? selected.ID_master : null,
                        }));
                      }}
                      selectedVal={tab4Header.ID_Design || -1}
                      placeholder="--Select Design--"
                      width="100%"
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={itemtypeOptions}
                      handleChange={(e) => {
                        const res = itemtypeOptions.find(
                          (i) => i.value === e.target.value
                        )?.Approx_Gross_Weight;
                        setTab4Header((p) => ({
                          ...p,
                          ID_ItemType: e.target.value,
                          Weight: res || "",
                        }));
                      }}
                      selectedVal={tab4Header.ID_ItemType || -1}
                      placeholder="--Select Item Type--"
                      width="100%"
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={itemOptions}
                      handleChange={(e) =>
                        setTab4Header((p) => ({
                          ...p,
                          ID_Item: e.target.value,
                        }))
                      }
                      selectedVal={tab4Header.ID_Item || -1}
                      placeholder="--Select Item--"
                      width="100%"
                      disabled
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={sizeOptions}
                      handleChange={(e) =>
                        setTab4Header((p) => ({
                          ...p,
                          ID_Size: e.target.value,
                        }))
                      }
                      selectedVal={tab4Header.ID_Size || -1}
                      placeholder="--Select Size--"
                      width="100%"
                    />
                  </td>
                  <td>
                    <input
                      name="Pcs"
                      type="number"
                      value={tab4Header.Pcs}
                      onChange={handleChange}
                      className="input-cell text-xs md:text-sm py-1"
                      placeholder="Pcs"
                    />
                  </td>
                  <td>
                    <input
                      name="Weight"
                      type="number"
                      value={tab4Header.Weight}
                      onChange={handleChange}
                      readOnly
                      className="input-cell text-xs md:text-sm py-1 bg-gray-100"
                      placeholder="Auto Come"
                    />
                  </td>
                  <td>
                    <input
                      name="GWeight"
                      type="number"
                      value={tab4Header.GWeight}
                      readOnly
                      className="input-cell text-xs md:text-sm py-1 bg-gray-100"
                      placeholder="Auto Calculated"
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <input
                        name="ID_Color"
                        value={tab4Header.ID_Color}
                        onChange={handleChange}
                        readOnly
                        placeholder="Color Display"
                        className="input-cell text-xs md:text-sm py-1"
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
                        value={tab4Header.stones.length || ""}
                        readOnly
                        placeholder="Stone D."
                        className="input-cell text-xs md:text-sm py-1"
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

        {/* Submit Button */}
        <Col xs={12} className="d-flex justify-content-end mb-2">
          <Button variant="success" onClick={handleSave} size="sm">
            {addIsLoading ? "Please wait..." : "Submit"}
          </Button>
        </Col>

        {/* Table */}
        <Col xs={12}>
          <Tab4MasterTable
            search={searchData}
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

      {/* Modals */}
      {showModal && (
        <Tab4Color
          show={showModal}
          handleClose={() => setShowModal(false)}
          rows={tab4Header.colors}
          setRows={handleSaveDetails}
          colorOptions={colorOptions}
        />
      )}

      {showModal1 && (
        <Tab4Stone
          show={showModal1}
          handleClose={() => setShowModal1(false)}
          rows={tab4Header.stones}
          setRows={(rows) => setTab4Header((p) => ({ ...p, stones: rows }))}
          sizeOptions={sizeOptions}
          stoneMainOptions={stoneMainOptions}
          stoneSubOptions={stoneSubOptions}
          colorOptions={colorOptions}
        />
      )}
    </Container>
  );
}

export default Tab4Master;
