"use client";

import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Modal } from "react-bootstrap";

const SearchableDropDown = ({
  options,
  handleChange,
  selectedVal,
  label,
  placeholder,
  defaultval,
  width = "w-full",
  directSearch = false,
  disabled = false, // New disabled prop
}) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (!disabled) {
      setShow(true);
    }
  };

  const findSelectedValue = () => {
    if (Array.isArray(options) && options.length !== 0) {
      const vl = options?.filter((item) => item?.value == selectedVal);
      return vl[0]?.label || "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    if (disabled) return;

    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredOptions([]);
      setShowDropdown(false);
      return;
    }

    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
    setShowDropdown(true);
  };

  const handleOptionSelect = (option) => {
    if (disabled) return;

    const obj = { target: { value: option.value, name: label } };
    handleChange(obj);
    setSearchTerm(option.label);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Tab") {
      e.preventDefault();
      setShowDropdown(false);
      handleShow();
    }
    if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(findSelectedValue());
  }, [selectedVal, options]);

  useEffect(() => {
    if (show && selectRef.current) {
      setTimeout(() => selectRef.current.focus(), 100);
    }
  }, [show]);

  return (
    <div className={`relative ${width}`}>
      {/* Input */}
      <div className="flex w-full">
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={directSearch ? searchTerm : findSelectedValue()}
          onChange={directSearch ? handleInputChange : () => {}}
          onKeyUp={handleKeyDown}
          onClick={directSearch ? () => {} : handleShow}
          disabled={disabled}
          className={`
            flex-grow rounded-l-md border px-2 py-1 text-sm focus:outline-none focus:ring-1 transition-colors
            ${
              disabled
                ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                : "border-gray-300 text-gray-700 focus:ring-blue-300 focus:border-blue-300"
            }
          `}
        />
        <button
          onClick={handleShow}
          disabled={disabled}
          className={`
            border border-l-0 rounded-r-md px-2 py-1 transition
            ${
              disabled
                ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
            }
          `}
        >
          <i className="bi bi-search"></i>
        </button>
      </div>

      {/* Dropdown suggestions for directSearch */}
      {directSearch &&
        showDropdown &&
        filteredOptions.length > 0 &&
        !disabled && (
          <ul
            ref={dropdownRef}
            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg z-20"
          >
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionSelect(option)}
                className="cursor-pointer px-2 py-1 hover:bg-blue-100"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}

      {/* Modal for traditional search */}
      <Modal
        show={show && !disabled}
        onHide={handleClose}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{placeholder}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            ref={selectRef}
            defaultValue={defaultval}
            value={options.find((opt) => opt.value === selectedVal) || null}
            isClearable
            options={options}
            isSearchable
            onChange={(e) => {
              const obj = {
                target: { value: e ? e.value : null, name: label },
              };
              handleChange(obj);
              handleClose();
            }}
            placeholder={`--${placeholder}--`}
            menuIsOpen
            autoFocus
            openMenuOnFocus
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: "none",
                borderColor: "#ced4da",
                "&:hover": { borderColor: "#adb5bd" },
              }),
              menu: (base) => ({
                ...base,
                marginTop: 0,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                zIndex: 50,
              }),
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Disabled overlay tooltip */}
      {disabled && (
        <div
          className="absolute inset-0 rounded-md bg-gray-50 bg-opacity-50 cursor-not-allowed"
          title="This field is disabled"
        ></div>
      )}
    </div>
  );
};

export default SearchableDropDown;
