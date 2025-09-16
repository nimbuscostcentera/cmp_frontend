import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./authNavBar.css";
import "../../GlobalStyle/GlobalTheme.css";
import useControlSidebar from "../../store/useControlSidebar";
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Import Tooltip from react-bootstrap

function DynamicSidebar() {
  const { Open, CloseSideBarMenu, OpenSideBarMenu } = useControlSidebar();
  const [show, setShow] = useState(false);

  function toggleNav() {
    setShow(!show);
    const titlediv = document.getElementById("title-div");
    const title = document.getElementById("title-h");
    const sidebar = document.getElementById("mySidebar");
    if (Open) {
      CloseSideBarMenu();
      title.classList.add("close");
      titlediv.classList.add("close");
      sidebar.classList.add("close");
    } else {
      OpenSideBarMenu();
      title.classList.remove("close");
      titlediv.classList.remove("close");
      sidebar.classList.remove("close");
    }
  }

  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>; // Use Tooltip from react-bootstrap
  let auth = localStorage.getItem("auth-storage");
  let { state={} } = (auth && JSON.parse(auth)) || {};
  let { permission=[] } = state;
  let customerMenu = permission?.filter((item) => item?.Cust_Type ==1);
  let WholeSalerMenu = permission?.filter((item) => item?.Cust_Type == 2);
    let MahajonMenu = permission?.filter((item) => item?.Cust_Type == 3);
    let MasterMenu = permission?.filter((item) => item?.Cust_Type == 5);
    let AdjustmentMenu = permission?.filter((item) => item?.Cust_Type == 4);

  return (
    <div className="sidebar" id="mySidebar">
      {/**Menu Header */}
      <div className="sidebar-header" id="title-div">
        <h6 className="sidebar-title" id="title-h">
          Menu
        </h6>
        <button className="toggle-btn" onClick={toggleNav}>
          <i className="bi bi-list"></i>
        </button>
      </div>
      <div style={{ padding: "0" }}>
        {/** Report */}
        <details>
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("All Reports")}
            >
              <i
                className="bi bi-graph-up me-2"
                style={{ fontSize: "20px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>All Reports</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/report"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Registered Report")}
              >
                <i className="bi bi-graph-up-arrow ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Registered Report</span>}
            </Link>
            <Link
              to={"/auth/stockreport"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Stock Report")}
              >
                <i className="bi bi-graph-up-arrow ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Stock Report</span>}
            </Link>
            <Link
              to={"/auth/ccreport"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("CC wise Report")}
              >
                <i className="bi bi-graph-up-arrow ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">CC wise Report</span>}
            </Link>
          </div>
        </details>

        {/** Manage Customer */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manage Customer")}
            >
              <i className="bi bi-person me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage Customer</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            {customerMenu?.map((item, index) => {
              return (
                <div key={item?.ID || index}>
                  {item?.View == 1 ? (
                    <Link
                      to={{
                        pathname: `${item?.Link}`,
                        search: `${item?.Parameters}`,
                      }}
                      className="border-bottom border-secondary"
                      key={item?.ID || index}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={renderTooltip(`${item?.Description}`)}
                      >
                        <i className={`bi ${item?.Icon} pe-2 ps-3`}></i>
                      </OverlayTrigger>
                      {Open && <span className="ml-2">{item?.PageName}</span>}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </details>
        {/** Manage Wholesaler */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manage WholeSaler")}
            >
              <i className="bi bi-people me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage WholeSaler</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            {WholeSalerMenu?.map((item, index) => {
              return (
                <div key={item?.ID || index}>
                  {item?.View == 1 ? (
                    <Link
                      to={{
                        pathname: `${item?.Link}`,
                        search: `${item?.Parameters}`,
                      }}
                      className="border-bottom border-secondary"
                      key={item?.ID || index}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={renderTooltip(`${item?.Description}`)}
                      >
                        <i className={`bi ${item?.Icon} pe-2 ps-3`}></i>
                      </OverlayTrigger>
                      {Open && <span className="ml-2">{item?.PageName}</span>}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </details>
        {/** Manage Mahajon */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manage Mahajon")}
            >
              <i className="bi bi-people me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage Mahajon</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            {MahajonMenu?.map((item, index) => {
              return (
                <div key={item?.ID || index}>
                  {item?.View == 1 ? (
                    <Link
                      to={{
                        pathname: `${item?.Link}`,
                        search: `${item?.Parameters}`,
                      }}
                      className="border-bottom border-secondary"
                      key={item?.ID || index}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={renderTooltip(`${item?.Description}`)}
                      >
                        <i className={`bi ${item?.Icon} pe-2 ps-3`}></i>
                      </OverlayTrigger>
                      {Open && <span className="ml-2">{item?.PageName}</span>}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </details>

        {/** Manage Master */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manager Master")}
            >
              <i
                className="bi bi-person-gear me-2"
                style={{ fontSize: "22px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>Manager Master</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            {MasterMenu?.map((item, index) => {
              return (
                <div key={item?.ID || index}>
                  {item?.View == 1 ? (
                    <Link
                      to={{
                        pathname: `${item?.Link}`,
                        search: `${item?.Parameters}`,
                      }}
                      className="border-bottom border-secondary"
                      key={item?.ID || index}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={renderTooltip(`${item?.Description}`)}
                      >
                        <i className={`bi ${item?.Icon} pe-2 ps-3`}></i>
                      </OverlayTrigger>
                      {Open && <span className="ml-2">{item?.PageName}</span>}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </details>

        {/** Manage Admin settings */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Admin SetUp")}
            >
              <i
                className="bi bi-shield-lock me-2"
                style={{ fontSize: "20px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>Admin SetUp</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            {AdjustmentMenu?.map((item, index) => {
              return (
                <div key={item?.ID || index}>
                  {item?.View == 1 ? (
                    <Link
                      to={{
                        pathname: `${item?.Link}`,
                        search: `${item?.Parameters}`,
                      }}
                      className="border-bottom border-secondary"
                      key={item?.ID || index}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={renderTooltip(`${item?.Description}`)}
                      >
                        <i className={`bi ${item?.Icon} pe-2 ps-3`}></i>
                      </OverlayTrigger>
                      {Open && <span className="ml-2">{item?.PageName}</span>}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}

export default DynamicSidebar;
