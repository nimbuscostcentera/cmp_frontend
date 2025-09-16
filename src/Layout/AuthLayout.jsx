import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

function AuthLayout() {
  return (
    <Container fluid style={{ height: "100vh", padding: 0, margin: 0 }}>
      <Row className="w-100 h-100 m-0">
        <Col
          xs={12}
          className="d-flex justify-content-center align-items-center p-0 m-0"
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default AuthLayout;
