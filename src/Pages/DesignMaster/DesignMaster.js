import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import useDesignMaster from "../../Store/MasterStore/useDesignMaster";
import Layout13Table from "../Layout13/Layout13Table";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";
import useLayout10Master from "../../Store/MasterStore/useLayout10Master";
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";
import SearchableDropDown from "../../Components/SearchableDropDown";
import DesignDetailsModel from "./DesignDetailsModel";
import DesignItemTypeModel from "./DesignItemTypeModel";
import DesignMasterTable from "./DesignMasterTable";

function DesignMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [layoutItem, setLayoutItem] = useState([]);
  const [layoutdgm, setLayoutdgm] = useState([]);
  const [layoutsize, setLayoutsize] = useState([]);
  const [layoutitm, setLayoutitm] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  // ✅ Zustand store
  const { addIsLoading, addError, addIsSuccess, addDesign, clearAddState } =
    useDesignMaster();
  const fileInputRef = useRef(null); // 👈 add this line
  // Masters for dropdowns
  const { layout2, fetchLayout2 } = useLayout2Master(); // Stone Master
  const { layout10, fetchLayout10 } = useLayout10Master(); // Stone Sub Master
  const { layout1, fetchLayout1 } = useLayout1Master(); // Size Master

  const [designHeader, setDesignHeader] = useState({
    Design_Code: "",
    Design_Description: "",
    Design_Group: "",
    ID_master: "",
    Picture: "",
    Tolerance_Lower: "",
    Tolerance_Upper: "",
    Details: [],
    ItemTypeDetails: [],
  });

  // Dropdown Data
  const dropdownListStoneM = useMemo(
    () => layout2.map((item) => ({ label: item.Code, value: item.ID })),
    [layout2]
  );

  const dropdownListStoneS = useMemo(
    () =>
      layout10.map((item) => ({
        label: item.Sub_Code,
        value: item.Sub_ID,
        Weight: item.Weight,
      })),
    [layout10]
  );

  const dropdownListSize = useMemo(
    () => layoutsize.map((item) => ({ label: item.Code, value: item.ID })),
    [layoutsize]
  );

  const dropdownitem = useMemo(
    () => layoutItem.map((item) => ({ label: item.Code, value: item.ID })),
    [layoutItem]
  );

  const dropdowndgm = useMemo(
    () => layoutdgm.map((item) => ({ label: item.Code, value: item.ID })),
    [layoutdgm]
  );
  const dropdownitm = useMemo(
    () => layoutitm.map((item) => ({ label: item.Code, value: item.ID })),
    [layoutitm]
  );

  useEffect(() => {
    inputRef.current?.focus();
    fetchLayout2("sm");
    fetchLayout10("ssm");

    async function fetchLayout() {
      const res = await fetchLayout1("im");
      setLayoutItem(res);
      const res1 = await fetchLayout1("dgm");
      setLayoutdgm(res1);
      const res2 = await fetchLayout1("szm");
      setLayoutsize(res2);
      const res3 = await fetchLayout1("itm");
      setLayoutitm(res3);
    }
    fetchLayout();
  }, []);

  // Handle input change
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;


    if( name === "Tolerance_Lower" || name === "Tolerance_Upper"){
     const regex = /^[0-9]{0,6}$/;
      if (value !== "" && !regex.test(value)) return;
    }
    setDesignHeader((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileObj(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ✅ Save Data
  const SaveData = async () => {
    const {
      Design_Code,
      Design_Description,
      Design_Group,
      ID_master,
    } = designHeader;

    if (
      !Design_Code ||
      !Design_Description ||
      !Design_Group ||
      !ID_master 
    ) {
      toast.error("All mandatory fields must be filled");
      return;
    }


    console.log(designHeader, "designHeader");
    if (
      designHeader?.Tolerance_Lower !== "" &&
      designHeader?.Tolerance_Upper !== ""
    ) {
      if (designHeader?.Tolerance_Lower >= designHeader?.Tolerance_Upper) {
        toast.error(
          "Tolerance Lower cannot be greater than or equal to Tolerance Upper"
        );
        return;
      }
      if (
        designHeader?.Tolerance_Lower < 0 ||
        designHeader?.Tolerance_Upper < 0
      ) {
        toast.error("Tolerance values cannot be negative");
        return;
      }
    } 
  


    const formData = new FormData();
    formData.append("Design_Code", designHeader.Design_Code);
    formData.append("Design_Description", designHeader.Design_Description);
    formData.append("Design_Group", designHeader.Design_Group);
    formData.append("ID_master", designHeader.ID_master);
    formData.append("Tolerance_Lower", designHeader.Tolerance_Lower || "");
    formData.append("Tolerance_Upper", designHeader.Tolerance_Upper || "");

    // ✅ Important: send Design Details as stringified JSON
    const detailsForBackend = designHeader.Details.map((detail) => ({
      Srl_Col: detail.Srl_Col,
      ID_StoneM: detail.ID_StoneM,
      ID_StoneS: detail.ID_StoneS,
      ID_Size: detail.ID_Size,
      Pcs: detail.Pcs,
      Weight: detail.Weight,
    }));

    formData.append("Details", JSON.stringify(detailsForBackend));

    // ✅ Stringify ItemTypeDetails for backend
    const itemTypeDetailsForBackend = designHeader.ItemTypeDetails.map(
      (itm) => ({
        ID_ItemType: itm.ID_ItemType,
        Approx_Gross_Weight: itm.Approx_Gross_Weight,
      })
    );
    formData.append(
      "ItemTypeDetails",
      JSON.stringify(itemTypeDetailsForBackend)
    );

    if (fileObj) formData.append("Picture", fileObj);

    await addDesign("header", formData); // ✅ use Zustand addDesign
  };

  // ✅ After Save success or error
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Design Master Added Successfully");
      setDesignHeader({
        Design_Code: "",
        Design_Description: "",
        Design_Group: "",
        ID_master: "",
        Picture: "",
        Tolerance_Lower: "",
        Tolerance_Upper: "",
        Details: [],
        ItemTypeDetails: [],
      });
      setPreviewImage(null);
      setFileObj(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // 👈 reset file input
      }
    }
    if (addError) toast.error(addError);
    clearAddState();
  }, [addIsSuccess, addError]);

  const handleSaveDetails = (rows) => {
    setDesignHeader((prev) => ({ ...prev, Details: rows }));
  };
  const handleSaveItemType = (rows) => {
    setDesignHeader((prev) => ({ ...prev, ItemTypeDetails: rows }));
  };

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <h5 className="mb-0 text-sm md:text-base">Design Master</h5>
          {/* <hr className="my-1" /> */}
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
                  <th>Code*</th>
                  <th>Description*</th>
                  <th>Design Group*</th>
                  <th>Item*</th>
                  <th>Picture</th>
                  <th>Tol Lower</th>
                  <th>Tol Upper</th>
                  <th style={{ width: "180px" }}>Stone Details</th>
                  <th style={{ width: "200px" }}>Item T. Details</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                  </td>
                  <td>
                    <input
                      name="Design_Code"
                      value={designHeader.Design_Code}
                      onChange={OnChangeHandler}
                      placeholder="Code"
                      maxLength={15}
                      ref={inputRef}
                      className="input-cell text-xs md:text-sm py-1"
                    />
                  </td>
                  <td>
                    <input
                      name="Design_Description"
                      value={designHeader.Design_Description}
                      onChange={OnChangeHandler}
                      placeholder="Description"
                      maxLength={30}
                      className="input-cell text-xs md:text-sm py-1"
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={dropdowndgm}
                      handleChange={(e) =>
                        setDesignHeader((prev) => ({
                          ...prev,
                          Design_Group: e.target.value,
                        }))
                      }
                      selectedVal={designHeader.Design_Group || -1}
                      placeholder={"--Select Group--"}
                      width={"100%"}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={dropdownitem}
                      handleChange={(e) =>
                        setDesignHeader((prev) => ({
                          ...prev,
                          ID_master: e.target.value,
                        }))
                      }
                      selectedVal={designHeader.ID_master || -1}
                      placeholder={"--Select Item--"}
                      width={"100%"}
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef} // 👈 add ref here
                      onChange={handleImageUpload}
                      className="input-cell text-xs md:text-sm"
                    />
                  </td>
                  <td>
                    <input
                      name="Tolerance_Lower"
                      type="number"
                      value={designHeader.Tolerance_Lower}
                      onChange={OnChangeHandler}
                      placeholder="Tol Lower"
                      className="input-cell text-xs md:text-sm py-1"
                    />
                  </td>
                  <td>
                    <input
                      name="Tolerance_Upper"
                      type="number"
                      value={designHeader.Tolerance_Upper}
                      onChange={OnChangeHandler}
                      placeholder="Tol Upper"
                      className="input-cell text-xs md:text-sm py-1"
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <input
                        placeholder="Count"
                        className="input-cell"
                        value={designHeader.Details.length}
                        readOnly
                        style={{ width: "50px", marginRight: "5px" }}
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
                        placeholder="Count"
                        className="input-cell"
                        value={designHeader.ItemTypeDetails.length}
                        readOnly
                        style={{ width: "50px", marginRight: "5px" }}
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
          {/* Search Field */}
          <div className="flex-grow" style={{ maxWidth: "250px" }}>
            <div className="d-flex align-items-center border border-blue-400 rounded-md p-1 text-xs md:text-sm">
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

          {/* Save Button */}
          <Button
            variant="success"
            onClick={SaveData}
            disabled={isDisable}
            size="sm"
          >
            {addIsLoading ? "Please wait..." : "Submit"}
          </Button>
        </Col>

        <Col xs={12}>
          <DesignMasterTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
            setTextDetail={setTextDetail}
            type="header"
            dropdowndgm={dropdowndgm}
            dropdownitem={dropdownitem}
            stoneMOptions={dropdownListStoneM}
            stoneSOptions={dropdownListStoneS}
            sizeOptions={dropdownListSize}
            dropdownitm={dropdownitm}
          />
        </Col>
      </Row>

      {showModal && (
        <DesignDetailsModel
          show={showModal}
          handleClose={() => setShowModal(false)}
          rows={designHeader.Details}
          setRows={handleSaveDetails}
          stoneMOptions={dropdownListStoneM}
          stoneSOptions={dropdownListStoneS}
          sizeOptions={dropdownListSize}
        />
      )}
      {showModal1 && (
        <DesignItemTypeModel
          show={showModal1}
          handleClose={() => setShowModal1(false)}
          rows={designHeader.ItemTypeDetails}
          setRows={handleSaveItemType}
          itmOptions={dropdownitm}
        />
      )}
    </Container>
  );
}

export default DesignMaster;
