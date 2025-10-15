import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import useSetup from "../../Store/MasterStore/useSetup";
import "react-toastify/dist/ReactToastify.css";

function Setup() {
  const [isDisable, setIsDisable] = useState(false);

  const [formData, setFormData] = useState({
    ReminderDays: true,
    AutoVouDate: true,
    NegativeStoneStock: true,
    NegativeRawMaterial: true,
    OrderStoneValid: true,
  });

  const {
    setupData,
    fetchSetup,
    addSetup,
    updateSetup,
    addIsLoading,
    updateIsLoading,
    addIsSuccess,
    updateIsSuccess,
    addError,
    updateError,
    clearAddState,
    clearUpdateState,
  } = useSetup();

  useEffect(() => {
    fetchSetup();
  }, [fetchSetup]);

  useEffect(() => {
    if (setupData) {
      setFormData({
        ReminderDays: !!setupData.ReminderDays,
        AutoVouDate: !!setupData.AutoVouDate,
        NegativeStoneStock: !!setupData.NegativeStoneStock,
        NegativeRawMaterial: !!setupData.NegativeRawMaterial,
        OrderStoneValid: !!setupData.OrderStoneValid,
      });
    }
  }, [setupData]);

  const OnChangeHandler = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const SaveData = async () => {
    try {
      if (setupData?.ID) {
        await updateSetup(setupData.ID, formData);
        toast.success("Setup updated successfully!");
      } else {
        await addSetup(formData);
        toast.success("Setup added successfully!");
      }
    } catch {
      toast.error("Failed to save setup!");
    }
  };

  useEffect(() => {
    if (addIsSuccess) {
      toast.success("Setup Added Successfully");
      clearAddState();
      fetchSetup();
    }
    if (addError) {
      toast.error(addError);
      clearAddState();
    }
    if (updateError) {
      toast.error(updateError);
      clearUpdateState();
    }
  }, [
    addIsSuccess,
    updateIsSuccess,
    addError,
    updateError,
    clearAddState,
    clearUpdateState,
    fetchSetup,
  ]);

  const setupOptions = [
    {
      name: "ReminderDays",
      label: "Reminder Days",
      description: "Auto-fetch against delivery date",
      icon: "bi-bell",
      color: "#007bff",
    },
    {
      name: "AutoVouDate",
      label: "Voucher Date Auto",
      description: "Default ON for automatic voucher dating",
      icon: "bi-calendar-check",
      color: "#17a2b8",
    },
    {
      name: "NegativeStoneStock",
      label: "Negative Stone Stock",
      description: "Allow negative stock for stones",
      icon: "bi-gem",
      color: "#ffc107",
    },
    {
      name: "NegativeRawMaterial",
      label: "Negative Raw Material",
      description: "Allow negative stock for raw materials",
      icon: "bi-box",
      color: "#fd7e14",
    },
    {
      name: "OrderStoneValid",
      label: "Order Stone Validation",
      description: "Default ON for order validation",
      icon: "bi-shield-check",
      color: "#6f42c1",
    },
  ];

  return (
    <Container fluid className="p-4  min-vh-100">
      <ToastContainer position="top-right" autoClose={2000} />

      <Row className="justify-content-center">
        <Col xl={10} lg={12}>
          {/* Header Section */}
          <div className="text-center mb-5">
            <div className="mb-3">
              <i
                className="bi bi-gear-fill text-primary"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">System Configuration</h2>
            <p className="text-muted fs-6">
              Manage your application settings and preferences easily.
            </p>
          </div>

          {/* Configuration Cards */}
          <Row className="g-4 mb-5">
            {setupOptions.map((option) => (
              <Col key={option.name} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm rounded-3 hover-card beautiful-card">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: `${option.color}15`,
                        }}
                      >
                        <i
                          className={`${option.icon}`}
                          style={{ fontSize: "1.3rem", color: option.color }}
                        ></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold text-dark mb-1">
                          {option.label}
                        </h6>
                        <p className="text-muted small mb-0">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`small fw-medium ${
                          formData[option.name]
                            ? "text-success"
                            : "text-secondary"
                        }`}
                      >
                        {formData[option.name] ? "Enabled" : "Disabled"}
                      </span>

                      {/* Toggle Switch */}
                      <label className="switch m-0">
                        <input
                          type="checkbox"
                          name={option.name}
                          checked={formData[option.name] || false}
                          onChange={OnChangeHandler}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Action Buttons */}
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h6 className="fw-semibold text-dark mb-1">
                  Ready to update your configuration?
                </h6>
                <p className="text-muted small mb-0">
                  {setupData?.ID
                    ? "Update your existing settings"
                    : "Save your new configuration"}
                </p>
              </div>
              <div className="mt-3 mt-md-0 d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => fetchSetup()}
                  disabled={addIsLoading || updateIsLoading}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={SaveData}
                  disabled={isDisable || addIsLoading || updateIsLoading}
                  className="px-4 fw-semibold"
                >
                  {addIsLoading || updateIsLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : setupData?.ID ? (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Update Setup
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>Save Setup
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom Switch + Card Styles */}
      <style jsx>{`
        .beautiful-card {
          background: linear-gradient(135deg, #ffffff, #f9fafc);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .beautiful-card:hover {
          transform: translateY(-3px);
          box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #fefefe, #f3f6fa);
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ced4da;
          transition: 0.4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #007bff;
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }
      `}</style>
    </Container>
  );
}

export default Setup;
