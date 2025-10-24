import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../../Store/AuthStore/useAuth";
import "react-toastify/dist/ReactToastify.css";
import ImgLogo from "../../Asset/nimbussystems_logo.jfif";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState({ contact: "", password: "" });

  const navigate = useNavigate();

  const {
    loginUser,
    loginIsSuccess,
    loginError,
    loginIsLoading,
    clearLoginState,
  } = useAuth();

  const InputHandler = (e) => {
    const { name, value } = e.target;
     if (name === "contact") {
       // Allow only digits
       if (!/^\d*$/.test(value)) return;

       // Limit to 10 digits
       if (value.length > 10) return;

       // If at least 1 digit is entered, ensure it starts with 6-9
       if (value.length === 1 && !/[6-9]/.test(value[0])) return;
     }
    setData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const SubmitHandler = async (event) => {
    event.preventDefault();
    if (!data.contact || !data.password) {
      toast.error("Please enter both fields", { autoClose: 3000 });
      return;
    }

    await loginUser({
      contact: data.contact,
      password: data.password,
    });
  };

  // 🧠 Navigation effect after successful login
  useEffect(() => {
    if (loginIsSuccess) {
      toast.success("Login successful! Redirecting...", { autoClose: 2000 });

      const timer = setTimeout(() => {
        navigate("/auth/home", { replace: true });
        clearLoginState(); // reset login state in store if needed
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loginIsSuccess, navigate, clearLoginState]);

  // 🧩 Optional: Handle error to show toast
  useEffect(() => {
    if (loginError) {
      toast.error(loginError, { autoClose: 3000 });
    }
  }, [loginError]);

  return (
    <Container fluid className="login-container p-0 m-0">
      <ToastContainer />
      <Row className="w-100 h-100 m-0">
        <Col md={6} className="brand-panel d-none d-md-flex">
          <div className="brand-overlay">
            <div className="brand-content">
              <div className="d-flex justify-content-center align-items-center mb-4">
                <img src={ImgLogo} width="20%" alt="Company Logo" />
              </div>
              <h1 className="company-name">NIMBUS SYSTEMS PVT. LTD.</h1>
              <p className="company-tagline">
                Software Solutions & Business Systems
              </p>
            </div>
          </div>
        </Col>

        <Col
          md={6}
          className="form-panel d-flex justify-content-center align-items-center"
        >
          <div className="login-form-container">
            <div className="logo-container mb-4">
              <h2 className="app-name">Costume Manufacturing Systems</h2>
            </div>

            <Form onSubmit={SubmitHandler} className="w-100">
              <Form.Group className="mb-3">
                <div className="input-group-custom">
                  <span className="input-icon">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <Form.Control
                    type="number"
                    placeholder="Mobile Number"
                    name="contact"
                    value={data.contact}
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
                disabled={!data.contact || !data.password || loginIsLoading}
              >
                {loginIsLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />{" "}
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
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
