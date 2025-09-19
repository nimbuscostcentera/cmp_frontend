import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../../Components/Table";
// import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
// import "./Home.css";

const Home = () => {
  const [activeMaster, setActiveMaster] = useState("color"); // 'color' or 'plating'
  const [formData, setFormData] = useState({ code: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [detailView, setDetailView] = useState("");
  const inputRef = useRef(null);

  // Sample data - in a real app this would come from an API
  const [colorData, setColorData] = useState([
    { id: 1, code: "COL001", description: "Red" },
    { id: 2, code: "COL002", description: "Blue" },
    { id: 3, code: "COL003", description: "Green" },
    { id: 3, code: "COL003", description: "Green" },
    { id: 3, code: "COL003", description: "Green" },
    { id: 3, code: "COL003", description: "Green" },
    { id: 3, code: "COL003", description: "Green" },
  ]);

  const [platingData, setPlatingData] = useState([
    { id: 1, code: "PLT001", description: "Gold Plating" },
    { id: 2, code: "PLT002", description: "Silver Plating" },
    { id: 3, code: "PLT003", description: "Chrome Plating" },
  ]);

  const currentData = activeMaster === "color" ? colorData : platingData;
  const setCurrentData =
    activeMaster === "color" ? setColorData : setPlatingData;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeMaster, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.code.trim() || !formData.description.trim()) {
      toast.error("All fields are mandatory!");
      return false;
    }

    if (!/^[A-Za-z0-9]{6}$/.test(formData.code)) {
      toast.error("Code must be exactly 6 alphanumeric characters!");
      return false;
    }

    if (formData.description.length > 15) {
      toast.error("Description must be 15 characters or less!");
      return false;
    }

    // Check for duplicate code
    const isDuplicate = currentData.some(
      (item, index) => item.code === formData.code && index !== editIndex
    );

    if (isDuplicate) {
      toast.error("This code already exists!");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditing) {
      // Update existing item
      const updatedData = [...currentData];
      updatedData[editIndex] = { ...formData, id: updatedData[editIndex].id };
      setCurrentData(updatedData);
      toast.success(
        `${
          activeMaster === "color" ? "Color" : "Plating"
        } updated successfully!`
      );
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Math.max(...currentData.map((item) => item.id), 0) + 1,
      };
      setCurrentData([...currentData, newItem]);
      toast.success(
        `${activeMaster === "color" ? "Color" : "Plating"} added successfully!`
      );
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ code: "", description: "" });
    setIsEditing(false);
    setEditIndex(-1);
  };

  const handleEdit = (index) => {
    const item = currentData[index];
    setFormData({ code: item.code, description: item.description });
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = currentData.filter((_, i) => i !== index);
    setCurrentData(updatedData);
    toast.success(
      `${activeMaster === "color" ? "Color" : "Plating"} deleted successfully!`
    );
    if (isEditing && editIndex === index) resetForm();
  };

  const handleSort = (field, type) => {
    // const sortedData = SortArrayByString("Asc", currentData, field);
    // setCurrentData([...sortedData]);
  };

  const filteredData = currentData.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableColumns = [
    {
      headername: "Code",
      fieldname: "code",
      type: "String",
      width: "90px",
    },
    {
      headername: "Description",
      fieldname: "description",
      type: "String",
      width: "90px",
    },
  ];

  return (
    <Container fluid className="home-container">
      <ToastContainer position="top-right" autoClose={3000} />



 

      <Row className="list-section">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {activeMaster === "color" ? "Color" : "Plating"} List
              </h5>
              <div className="search-box">
                <i className="bi bi-search"></i>
                <Form.Control
                  type="search"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-container">
                <Table
                  tab={filteredData}
                  Col={tableColumns}
                  onSorting={handleSort}
                  isEdit={true}
                  isDelete={true}
                  ActionFunc={handleEdit}
                  handleDelete={handleDelete}
                  getFocusText={setDetailView}
                  height="35vh"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="detail-section">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Detail View</h5>
            </Card.Header>
            <Card.Body>
              <Form.Control
                as="textarea"
                rows={2}
                value={detailView}
                readOnly
                placeholder="Select an item to view details"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
