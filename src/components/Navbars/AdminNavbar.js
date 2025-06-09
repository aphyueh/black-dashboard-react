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
import React from "react";
import classNames from "classnames";

// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Container,
  NavbarToggler,
} from "reactstrap";


function AdminNavbar(props) {
  const [collapseOpen, setcollapseOpen] = React.useState(false);
  const [color, setcolor] = React.useState("navbar-transparent");
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor("bg-white");
    } else {
      setcolor("navbar-transparent");
    }
  };
  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setcolor("navbar-transparent");
    } else {
      setcolor("bg-white");
    }
    setcollapseOpen(!collapseOpen);
  };

  const handleScroll = (e, path) => {
    e.preventDefault();
    if (collapseOpen) {
      toggleCollapse(); // Close the mobile menu if open
    }
    const id = path.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const { routes, notifications = []} = props;

  // const notifications = props.notifications || [];

  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <NavbarBrand href="/admin/dashboard">
              Color Cast Removal
            </NavbarBrand>
            {/* <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand> */}
          </div> 
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              {/* === NEW NAVIGATION LINKS === */}
              {routes.map((prop, key) => {
                if (!prop.showInNavbar) return null; // Only show links marked for the navbar
                return (
                  <NavItem key={key}>
                    <NavLink
                      href={prop.path}
                      onClick={(e) => handleScroll(e, prop.path)}
                      className="nav-link"
                    >
                      <i className={prop.icon} /> 
                      <p>{prop.name}</p>
                    </NavLink>
                  </NavItem>
                );
              })}

              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                >
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <i className="tim-icons icon-bell-55" />
                  <p className="d-lg-none">Notifications</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  {notifications.length === 0 ? (
                    <DropdownItem className="nav-item" disabled>
                      No notifications
                    </DropdownItem>
                  ) : (
                    notifications.map((note, index) => (
                      <DropdownItem key={index} className="nav-item">
                        {note}
                      </DropdownItem>
                    ))
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
