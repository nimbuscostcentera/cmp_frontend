import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImgLogo from "../../Asset/nimbussystems_logo.jfif";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

function Login() {
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState({
    ContactNumber: "",
    password: "",
  });

  const InputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const SubmitHandler = (event) => {
    event.preventDefault();
    if (!data.ContactNumber || !data.password) {
      toast.error("Please enter both fields", {
        autoClose: 3000,
        position: "top-right",
      });
      return;
    }
    toast.success("Login successful", {
      autoClose: 2000,
      position: "top-right",
    });
  };

  return (
    <Container fluid className="login-container p-0 m-0">
      <ToastContainer />

      <Row className="w-100 h-100 m-0">
        {/* Left Side - Branding Panel */}
        <Col md={6} className="brand-panel d-none d-md-flex">
          <div className="brand-overlay">
            <div className="brand-content">
              {/* Logo */}
              <div className="d-flex justify-content-center align-items-center mb-4">
                <img src={ImgLogo} width="20%" alt="Company Logo" />
              </div>
              <h1 className="company-name">NIMBUS SYSTEMS PVT. LTD.</h1>
              <p className="company-tagline">
                Software Solutions & Business Systems
              </p>
              <div className="feature-divider"></div>
            </div>
          </div>
        </Col>

        {/* Right Side - Login Form */}
        <Col
          md={6}
          className="form-panel d-flex justify-content-center align-items-center"
        >
          <div className="login-form-container">
            <div className="logo-container mb-4">
              {/* Logo */}
              {/* <div className="d-flex justify-content-center align-items-center">
                <img src={ImgLogo} width="20%" alt="Company Logo" />
              </div> */}
              <h2 className="app-name">Costume Manufacturing Systems</h2>
            </div>

            <Form onSubmit={SubmitHandler} className="w-100">
              <Form.Group className="mb-3">
                <div className="input-group-custom">
                  <span className="input-icon">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Mobile Number"
                    name="ContactNumber"
                    value={data.ContactNumber}
                    onChange={InputHandler}
                    maxLength={10}
                    className="custom-input"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="input-group-custom">
                  <span className="input-icon">
                    <i className="bi bi-key"></i>
                  </span>
                  <Form.Control
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={InputHandler}
                    maxLength={16}
                    className="custom-input"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4 d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id="showPasswordCheckbox"
                  checked={showPass}
                  onChange={() => setShowPass((prev) => !prev)}
                  className="custom-checkbox me-2"
                />
                <Form.Label
                  htmlFor="showPasswordCheckbox"
                  className="mb-0 show-password-label"
                >
                  Show password
                </Form.Label>
              </Form.Group>

              <button
                type="submit"
                className="login-btn w-100"
                disabled={!data.ContactNumber || !data.password}
              >
                Sign In
              </button>
            </Form>

            <div className="login-footer mt-4">
              <p className="copyright">
                Copyright: Nimbus Systems Pvt. Ltd. {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
