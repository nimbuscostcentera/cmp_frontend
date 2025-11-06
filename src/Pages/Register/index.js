import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import useAuth from "../../Store/AuthStore/useAuth";
import ImgLogo from "../../Asset/nimbussystems_logo.jfif";
function Register() {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    User_Name: "",
    Contact: "",
    Password: "",
    UType: "U",
    active: true,
  });

  const {
    registerUser,
    registerIsLoading,
    registerIsSuccess,
    registerError,
    clearRegisterState,
  } = useAuth();

  const InputHandler = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "Contact") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
      if (value.length === 1 && !/[6-9]/.test(value[0])) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.trimStart(),
    }));
  };

  const validateForm = () => {
    if (!formData.User_Name || !formData.Contact || !formData.Password) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (formData.Contact.length !== 10) {
      toast.error("Contact number must be 10 digits");
      return false;
    }

    if (formData.Password.length > 8) {
      toast.error("Password must be maximum 8 characters");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(formData.Password)) {
      toast.error(
        "Password must contain at least one uppercase, one lowercase, and one special character"
      );
      return false;
    }

    return true;
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await registerUser(formData);
  };

  useEffect(() => {
    if (registerIsSuccess) {
      toast.success("Registration successful!", { autoClose: 2000 });
      setFormData({
        User_Name: "",
        Contact: "",
        Password: "",
        UType: "U",
        active: true,
      });
      clearRegisterState();
    }
    if (registerError) {
      toast.error(registerError || "Registration failed");
      clearRegisterState();
    }
  }, [registerIsSuccess, registerError, clearRegisterState]);

  return (
    <Container fluid className="register-wrapper">
      <ToastContainer />
      <Row className="min-vh-100">
        {/* ✅ Left Side — Branding Section */}
        <Col
          md={6}
          className="d-none d-md-flex flex-column justify-content-center align-items-center left-section text-white"
        >
          <div className="text-center px-5 d-flex flex-column align-items-center">
            <img src={ImgLogo} width="20%" alt="Company Logo" />
            <h2 className="mb-3 fw-bold">Welcome to Nimbus Systems</h2>
            <p className="lead">
              Build impactful digital solutions with cutting-edge technology.
              Let's create something amazing together.
            </p>
          </div>
        </Col>

        {/* ✅ Right Side — Registration Form */}
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center align-items-center bg-light"
        >
          <Card
            className="register-card shadow-lg p-4 w-100 mx-3"
            style={{ maxWidth: "420px" }}
          >
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="register-title">Create Account</h3>
              </div>

              <Form onSubmit={SubmitHandler}>
                {/* Full Name */}
                <Form.Group className="mb-3">
                  <div className="input-group-custom">
                    <span className="input-icon">
                      <i className="bi bi-person"></i>
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Full Name *"
                      name="User_Name"
                      value={formData.User_Name}
                      onChange={InputHandler}
                      maxLength={255}
                      className="custom-input"
                    />
                  </div>
                </Form.Group>

                {/* Contact */}
                <Form.Group className="mb-3">
                  <div className="input-group-custom">
                    <span className="input-icon">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Contact Number *"
                      name="Contact"
                      value={formData.Contact}
                      onChange={InputHandler}
                      maxLength={10}
                      className="custom-input"
                    />
                  </div>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <div className="input-group-custom">
                    <span className="input-icon">
                      <i className="bi bi-lock"></i>
                    </span>
                    <Form.Control
                      type={showPass ? "text" : "password"}
                      placeholder="Password (max 8 chars) *"
                      name="Password"
                      value={formData.Password}
                      onChange={InputHandler}
                      maxLength={8}
                      className="custom-input"
                    />
                  </div>
                </Form.Group>

                {/* User Type */}
                <Form.Group className="mb-3">
                  <Form.Select
                    name="UType"
                    value={formData.UType}
                    onChange={InputHandler}
                    className="custom-input"
                  >
                    <option value="U">User</option>
                    <option value="A">Admin</option>
                    <option value="S">SuperUser</option>
                  </Form.Select>
                </Form.Group>

                {/* Active */}
                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="activeCheckbox"
                    name="active"
                    checked={formData.active}
                    onChange={InputHandler}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // ⛔ prevent form submit
                        e.stopPropagation(); // ⛔ prevent toggle on Enter
                        setFormData((prev) => ({
                          ...prev,
                          active: !prev.active,
                        }));
                      }
                    }}
                    className="me-2"
                  />
                  <Form.Label htmlFor="activeCheckbox" className="mb-0">
                    Active Account
                  </Form.Label>
                </Form.Group>

                {/* Show Password */}
                {/* Show Password */}
                <Form.Group className="mb-4 d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="showPasswordCheckbox"
                    checked={showPass}
                    onChange={() => setShowPass((prev) => !prev)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // ✅ stop form submit
                        e.stopPropagation(); // ✅ stop toggle trigger
                        setShowPass((prev) => !prev);
                      }
                    }}
                    className="me-2"
                  />
                  <Form.Label
                    htmlFor="showPasswordCheckbox"
                    className="mb-0 checkbox-label"
                  >
                    Show password
                  </Form.Label>
                </Form.Group>

                <button
                  type="submit"
                  className="register-btn w-100"
                  disabled={
                    registerIsLoading ||
                    !formData.User_Name ||
                    !formData.Contact ||
                    !formData.Password
                  }
                >
                  {registerIsLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Registering...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </Form>

              <div className="register-footer mt-4 text-center">
                <p className="mb-0 small text-muted">
                  &copy; {new Date().getFullYear()} Nimbus Systems Pvt. Ltd.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
