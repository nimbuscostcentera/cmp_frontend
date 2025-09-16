import React, { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "../../Asset/Nimbus_Logo_Transparent_white.png"; // logo
import "./authNavBar.css";

function AuthNavBar() {
  const navigate = useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchExpanded(false);
        setSearchQuery("");
      }
    };
    if (searchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchExpanded]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchExpanded(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="custom-navbar py-2 px-3 shadow-sm"
        fixed="top"
      >
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          {/* Left: Logo + Desktop Nav */}
          <div className="d-flex align-items-center">
            <Navbar.Brand
              as={Link}
              to="/auth"
              className="d-flex align-items-center me-3"
            >
              <img src={Image} alt="Nimbus Logo" className="navbar-logo" />
            </Navbar.Brand>

            {/* Desktop Nav (visible only lg and up) */}
            <div className="d-none d-lg-flex">
              <Nav>
                <Nav.Link as={Link} to="/auth/home" className="nav-link-custom">
                  <i className="bi bi-house me-1"></i> Home
                </Nav.Link>
                <Nav.Link as={Link} to="/auth/file" className="nav-link-custom">
                  <i className="bi bi-folder me-1"></i> File
                </Nav.Link>
              </Nav>
            </div>
          </div>

          {/* Right: Search + Profile/Icons */}
          <div className="d-flex align-items-center">
            {/* Desktop Search */}
            <div
              ref={searchRef}
              className={`search-container d-none d-lg-flex align-items-center ${
                searchExpanded ? "expanded" : ""
              }`}
            >
              <Form className="d-flex w-100" onSubmit={handleSearch}>
                <Form.Control
                  ref={inputRef}
                  type="search"
                  placeholder="Search menus..."
                  value={searchQuery}
                  onFocus={() => setSearchExpanded(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchExpanded && (
                  <Button
                    variant="link"
                    className="search-close-btn"
                    onClick={() => {
                      setSearchExpanded(false);
                      setSearchQuery("");
                    }}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </Form>

              {!searchExpanded && (
                <Button
                  variant="link"
                  className="search-icon-btn"
                  onClick={() => {
                    setSearchExpanded(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                >
                  <i className="bi bi-search"></i>
                </Button>
              )}
            </div>

            {/* Profile + Settings + Logout (always visible) */}
            <Nav className="align-items-center d-none d-lg-flex">
              <Nav.Link
                as={Link}
                to="/auth/profile"
                className="nav-link-custom"
              >
                <i className="bi bi-person-circle"></i>
              </Nav.Link>
              <Nav.Link as={Link} to="/auth/setup" className="nav-link-custom">
                <i className="bi bi-gear-fill"></i>
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-link-custom">
                <i className="bi bi-box-arrow-right"></i>
              </Nav.Link>
            </Nav>

            {/* Mobile Toggle & Search */}
            <div className="d-lg-none d-flex align-items-center">
              <Button
                variant="link"
                className="search-mobile-btn"
                onClick={() => {
                  setSearchExpanded(true);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }}
              >
                <i className="bi bi-search"></i>
              </Button>
              <Navbar.Toggle
                aria-controls="offcanvasNavbar"
                onClick={() => setShowOffcanvas(!showOffcanvas)}
              />
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Search Overlay */}
      {searchExpanded && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-container">
            <Form className="d-flex w-100" onSubmit={handleSearch}>
              <Form.Control
                ref={inputRef}
                type="search"
                placeholder="Search menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
                autoFocus
              />
              <Button
                variant="link"
                className="mobile-search-close"
                onClick={() => {
                  setSearchExpanded(false);
                  setSearchQuery("");
                }}
              >
                <i className="bi bi-x"></i>
              </Button>
            </Form>
          </div>
        </div>
      )}

      {/* Offcanvas Menu (Mobile only) */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/auth/home"
              className="offcanvas-nav-link"
              onClick={() => setShowOffcanvas(false)}
            >
              <i className="bi bi-house me-2"></i> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/auth/file"
              className="offcanvas-nav-link"
              onClick={() => setShowOffcanvas(false)}
            >
              <i className="bi bi-folder me-2"></i> File
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/auth/profile"
              className="offcanvas-nav-link"
              onClick={() => setShowOffcanvas(false)}
            >
              <i className="bi bi-person-circle me-2"></i> Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/auth/setup"
              className="offcanvas-nav-link"
              onClick={() => setShowOffcanvas(false)}
            >
              <i className="bi bi-gear-fill me-2"></i> Settings
            </Nav.Link>
            <hr />
            <Nav.Link
              onClick={() => {
                handleLogout();
                setShowOffcanvas(false);
              }}
              className="offcanvas-nav-link"
            >
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Padding for fixed navbar */}
      <div style={{ paddingTop: "76px" }}></div>
    </>
  );
}

export default AuthNavBar;
