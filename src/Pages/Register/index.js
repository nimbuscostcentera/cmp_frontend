import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import useAuth from "../../Store/AuthStore/useAuth"; // ✅ Import Zustand store

function Register() {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    User_Name: "",
    Contact: "",
    Password: "",
    UType: "U", // Default to 'User'
    active: true,
  });

  // ✅ Zustand actions and states
  const {
    registerUser,
    registerIsLoading,
    registerIsSuccess,
    registerError,
    clearRegisterState,
  } = useAuth();

  // ✅ Handle input change
  const InputHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.trimStart(),
    }));
  };

  // ✅ Form validation
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
    return true;
  };

  // ✅ Submit Handler (Calls Zustand action)
  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await registerUser(formData);
  };

  // ✅ React to registration result
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
    <Container fluid className="register-container">
      <ToastContainer />

      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="register-card shadow-lg">
            <Card.Body className="p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="register-title">Create Account</h3>
              </div>

              <Form onSubmit={SubmitHandler}>
                {/* User Name */}
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

                {/* Contact Number */}
                <Form.Group className="mb-3">
                  <div className="input-group-custom">
                    <span className="input-icon">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <Form.Control
                      type="number"
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
                  <div className="input-group-custom">
                    <span className="input-icon">
                      <i className="bi bi-person-badge"></i>
                    </span>
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
                  </div>
                </Form.Group>

                {/* Active Checkbox */}
                <Form.Group className="mb-4">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      id="activeCheckbox"
                      name="active"
                      checked={formData.active}
                      onChange={InputHandler}
                      className="custom-checkbox me-2"
                    />
                    <Form.Label
                      htmlFor="activeCheckbox"
                      className="mb-0 checkbox-label"
                    >
                      Active Account
                    </Form.Label>
                  </div>
                </Form.Group>

                {/* Show Password Checkbox */}
                <Form.Group className="mb-4">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      id="showPasswordCheckbox"
                      checked={showPass}
                      onChange={() => setShowPass((prev) => !prev)}
                      className="custom-checkbox me-2"
                    />
                    <Form.Label
                      htmlFor="showPasswordCheckbox"
                      className="mb-0 checkbox-label"
                    >
                      Show password
                    </Form.Label>
                  </div>
                </Form.Group>

                {/* Submit Button */}
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
                      <Spinner animation="border" size="sm" className="me-2" />{" "}
                      Registering...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </Form>

              {/* Footer */}
              <div className="register-footer mt-4 text-center">
                <p className="copyright mb-0">
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
