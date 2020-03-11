import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

export default function NavBar({ routes }) {
  const { user } = React.useContext(FirebaseContext);
  const history = useHistory();

  // COMPLETE NAVBAR CORRECTLY
  const renderNavLinks = () => (
    <>
      {routes.map(route => (
        <NavLink
          key={route.path}
          className="nav-link"
          to={route.path}
          exact={route.isExact}
        >
          {route.name}
        </NavLink>
      ))}
    </>
  );
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="/">
        <img
          src={process.env.PUBLIC_URL + "/favicon.png"}
          style={{ height: "1.5rem", marginRight: "10px", marginTop: "-4px" }}
          alt="logo"
        />
        Note App
      </Navbar.Brand>
      <Nav className="mr-auto">{renderNavLinks()}</Nav>
      <Nav>
        {user.data ? (
          <NavDropdown title={user.data.email} id="nav-dropdown">
            <NavDropdown.Item onClick={() => history.push("/profile")}>
              Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={user.signOut}>Sign Out</NavDropdown.Item>
          </NavDropdown>
        ) : (
          <NavLink className="nav-link" to="/login">
            Sign in
          </NavLink>
        )}
      </Nav>
    </Navbar>
  );
}
