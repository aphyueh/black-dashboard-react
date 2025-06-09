/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React , { useState , useRef } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";
import NotificationAlert from "react-notification-alert"

var ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);

  const [notifications, setNotifications] = useState([]);
  const notificationAlertRef = useRef(null);

  const notify = (type, message) => {
    const options = {
      place: "tr", // bottom right
      message: (
        <div>
          <div>
            <b>
              {type === "success" ? "Success - " : 
               type === "danger" ? "Error - " : 
               type === "info" ? "" : ""}
            </b>
            {message}
          </div>
        </div>
      ),
      type: type, // "success" or "danger"
      icon: type === "info" ? "tim-icons icon-notes" : "tim-icons icon-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
    
    // Save plain text notification for the navbar dropdown
    const plainMessage =
      (type === "success" ? "Success - " :
      type === "danger" ? "Error - " :
      type === "info" ? "" : "") + message;

    setNotifications((prev) => {
      const updated = [plainMessage, ...prev];
      return updated.slice(0, 10); // Keep max 10 latest
    });
  };  
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={<prop.component notify={notify} />} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <BackgroundColorContext.Consumer>
      {({ color, changeColor }) => (
        <React.Fragment>
          <NotificationAlert ref={notificationAlertRef} />
          <div className="wrapper">
          
            <div className="main-panel" ref={mainPanelRef} data={color} style={{ width: "100%" }}>
              <AdminNavbar
              
                notifications={notifications}
                routes={routes}
              />
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Routes>
              {
                <Footer fluid />
              }
            </div>
          </div>
          <FixedPlugin bgColor={color} handleBgClick={changeColor} />
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  );
}

export default Admin;
