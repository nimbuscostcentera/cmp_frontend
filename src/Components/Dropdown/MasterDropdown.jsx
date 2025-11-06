// src/Components/MasterDropdownMenu.jsx
import React, { useEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 *  - masters: array of master metadata (name, type, isStatic, redirectTo)
 *  - setType: optional function for LayoutMaster dynamic switching
 *  - selectedType: optional string (type) to reflect externally selected master
 *  - layoutMasterRoute: route where LayoutMaster lives (default '/auth/layout')
 *
 * Behavior:
 *  - shows selected master name if selectedType is provided or if a prior selection exists in localStorage
 *  - writes last selected type to localStorage so routed pages can read it and show the name
 */
const LS_KEY = "selectedMasterType";

const MasterDropdownMenu = ({
  masters = [],
  setType,
  selectedType = null,
  layoutMasterRoute = "/auth/layout",
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState(null);

  // 1) map helper to get master object by type
  const findByType = (type) =>
    masters.find((m) => m.type === type || m.value === type || m.name === type);

  // 2) on mount, initialize displayed selectedName from:
  //    - selectedType prop (highest priority), or
  //    - localStorage (last chosen), or
  //    - null (shows default)
  useEffect(() => {
    if (selectedType) {
      const m = findByType(selectedType);
      if (m) {
        setSelectedName(m.name);
        try {
          localStorage.setItem(LS_KEY, selectedType);
        } catch {}
        return;
      }
    }
    try {
      const last = localStorage.getItem(LS_KEY);
      if (last) {
        const m = findByType(last);
        if (m) setSelectedName(m.name);
      }
    } catch {}
  }, [selectedType, masters]);

  // 3) filter masters by search query
  const filtered = masters.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // 4) when selecting a master:
  const handleSelect = (m) => {
    if (!m) return;

    // clear search bar
    setSearch("");

    // show chosen name immediately
    setSelectedName(m.name);

    // persist selection so routed pages can read it
    try {
      localStorage.setItem(LS_KEY, m.type);
    } catch {}

    // static (routed) masters
    if (m.isStatic && m.redirectTo) {
      navigate(m.redirectTo);
      return;
    }

    // if parent gave setType (LayoutMaster) -> call it
    if (typeof setType === "function") {
      setType(m.type);
      return;
    }

    // otherwise navigate to LayoutMaster route and pass state (LayoutMaster will pick it)
    navigate(layoutMasterRoute, { state: { type: m.type } });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center my-2"
      style={{ gap: 12 }}
    >
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-primary"
          size="sm"
          className="rounded-pill px-3 py-1 shadow-sm text-capitalize"
        >
          {selectedName ? selectedName : "Select Master"}
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="p-0"
          style={{ minWidth: 280, maxHeight: 320, overflow: "hidden" }}
        >
          {/* Fixed Search Bar */}
          <div
            style={{
              position: "sticky",
              top: 0,
              background: "white",
              zIndex: 10,
              padding: "8px",
              borderBottom: "1px solid #dee2e6",
            }}
          >
            <Form.Control
              type="text"
              placeholder="Search master..."
              size="sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Scrollable List */}
          <div style={{ maxHeight: 280, overflowY: "auto", padding: "4px 0" }}>
            {filtered.length ? (
              filtered.map((m) => (
                <Dropdown.Item
                  key={m.type || m.name}
                  onClick={() => handleSelect(m)}
                >
                  {m.name}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No results</Dropdown.Item>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default MasterDropdownMenu;
