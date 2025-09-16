import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-grey text-black py-3 mt-auto">
      <Container fluid className="text-center">
        <p className="mb-0 ">
          © {new Date().getFullYear()} Nimbus Systems Pvt. Ltd. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
