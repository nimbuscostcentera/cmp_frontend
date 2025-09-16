import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import AuthNavBar from "../Components/Header/AuthNavBar";
// import Footer from "../Component/Footer";
// import SideBar from "../Component/Header/SideBar";
// import "../GlobalStyle/GlobalTheme.css";
import "./AuthLayout.css";
import { Outlet } from "react-router-dom";
// import useControlSidebar from "../store/useControlSidebar";
function PrivateLayout() {
  // const { Open } = useControlSidebar();
  const [Open , setOpen] = useState(true);
  useEffect(() => {
    const InnerContainer = document.getElementById("inner");
    if (!Open) {
      InnerContainer.classList.add("close");
    } else {
      InnerContainer.classList.remove("close");
    }
  });
  return (
    <Container fluid className="base-container d-flex">
      <div id="inner" className="inner-container">
        <AuthNavBar />
        <div style={{ overflow: "scroll", height: "95vh" }}>
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </Container>
  );
}

export default PrivateLayout;
