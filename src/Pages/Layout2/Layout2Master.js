import { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../Components/Table/table.css";
import Layout2Table from "./Layout2Table";
import SearchableDropDown from "../../Components/SearchableDropDown";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";
import useLayout9Master from "../../Store/MasterStore/useLayout9Master";
import useLayout7Master from "../../Store/MasterStore/useLayout7Master";

function Layout2Master() {
  const inputRef = useRef();
  const [type, setType] = useState("sm"); // 'sm' for Stone Master, 'dm' for Department Master
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  const [inputData, setInputData] = useState({
    Code: "",
    Description: "",
    ID_master: -1,
  });
  const { layout7, fetchLayout7 } = useLayout7Master();
  const { units, fetchUnits } = useLayout9Master();

  const dropdownList = useMemo(() => {
    if (type === "sm") {
      return units.map((item) => ({
        label: `${item.Unit_Code}`,
        value: item.Unit_ID,
      }));
    } else {
      return layout7.map((item) => ({
        label: `${item.Process_Code}`,
        value: item.Process_ID,
      }));
    }
  }, [units, layout7, type]);

  const { addLayout2, addIsLoading, addError, addIsSuccess, clearAddState } =
    useLayout2Master();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
    if (type === "sm") {
      fetchUnits(); // Load units on mount
    } else {
      fetchLayout7(); // Load processes on mount
    }
  }, [type]);

  // Handle input changes
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  // Save new item
  const SaveData = () => {
    const { Code, Description, ID_master } = inputData;
    if (!Code || !Description || ID_master === -1) {
      toast.error("All fields are mandatory");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Code)) {
      toast.error("Code must be alphanumeric & max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description must be alphanumeric & max 15 chars");
      return;
    }

    addLayout2(type, inputData);
  };

  // Fetch layout2 data on mount and after successful add
  // useEffect(() => {
  //   fetchLayout2(type);
  // }, [type, addIsSuccess]);

  // Show toast messages
  useEffect(() => {
    if (addIsSuccess && !addIsLoading && !addError) {
      toast.success("Item Added Successfully");
      setInputData({ Code: "", Description: "", ID_master: -1 });
    }
    if (addError && !addIsLoading) {
      toast.error(addError);
    }
    clearAddState();
  }, [addIsSuccess, addIsLoading, addError]);

  return (
    <Container fluid className="p-0" style={{ width: "98%" }}>
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12}>
          <div className="d-flex align-items-center">
            <h5 className="mb-0 text-sm md:text-base">
              {type === "sm" ? "Stone Master" : "Department Master"}
            </h5>
          </div>
          <hr className="my-1" />
        </Col>

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
                    <th className="text-xs md:text-sm">Master*</th>
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
                        value={inputData?.Code || ""}
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
                        value={inputData?.Description || ""}
                        onChange={OnChangeHandler}
                        maxLength={15}
                        style={{ width: "180px" }}
                      />
                    </td>
                    <td>
                      <SearchableDropDown
                        options={dropdownList}
                        handleChange={(e) => OnChangeHandler(e)}
                        selectedVal={inputData?.ID_master || -1}
                        label={"ID_master"}
                        placeholder={"--Select Type--"}
                        width={"100%"}
                        defaultval={-1}
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

        <Col xs={12} className="my-2">
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
        </Col>

        <Col xs={12}>
          <Layout2Table
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

export default Layout2Master;
