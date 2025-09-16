import React from "react";
import { Container } from "react-bootstrap";
import AuthNavBar from "../Components/Header/AuthNavBar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary";

function PrivateLayout() {
  return (
    <Container
      fluid
      className="d-flex flex-column"
      style={{ height: "100vh", padding: 0, textAlign: "center" }}
    >
      <AuthNavBar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
      <Footer />
    </Container>
  );
}

export default PrivateLayout;
