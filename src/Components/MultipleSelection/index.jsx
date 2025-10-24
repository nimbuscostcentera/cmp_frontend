import React, { useState } from "react";
import Select from "react-select";
import { Modal, InputGroup, Form, Button } from "react-bootstrap";

const MultipleSelection = ({
  options,
  handleChange,
  selectedVal = [],
  placeholder,
  defaultval,
  style = { width: "250px" },
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const findSelectedValue = () => {
    return selectedVal.map((element) => element?.label).join(", ");
  };

  const handleSelectionChange = (selected, actionMeta) => {
    // We don't need to handle remove separately because the parent component
    // can handle the entire selected array from the change.
    handleChange(selected);
  };

  return (
    <div style={style}>
      <InputGroup onClick={handleShow}>
        <Form.Control
          placeholder={placeholder}
          value={findSelectedValue()}
          readOnly
          style={{
            padding: "4px 5px",
            borderRadius: "3px",
            fontSize: "13px",
            color: "rgba(75, 75, 75, 0.62)",
            cursor: "pointer",
          }}
        />
        <InputGroup.Text
          style={{
            padding: "4px 5px",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            cursor: "pointer",
          }}
        >
          <i className="bi bi-search"></i>
        </InputGroup.Text>
      </InputGroup>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{placeholder}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            defaultValue={defaultval}
            isMulti
            value={selectedVal}
            options={options}
            onChange={handleSelectionChange}
            placeholder={`--${placeholder}--`}
            isSearchable
            closeMenuOnSelect={false}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MultipleSelection;
