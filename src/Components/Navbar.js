import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import routes from "../Router/routes";

export default function NavBar({ backgroundColor = "#007bff" }) {
  const { user, loading } = React.useContext(FirebaseContext);
  const history = useHistory();
  // COMPLETE NAVBAR CORRECTLY
  const renderNavLinks = routes
    .filter((route) => route.isNavBar)
    .map((route) => (
      <NavLink
        key={route.path}
        className="nav-link"
        to={route.path}
        exact={route.isExact}
      >
        <span className="material-icons">{route.name}</span>
      </NavLink>
    ));

  let logoPath = loading ? "/notepad-logo-animated.gif" : "/notepad-logo.png";
  return (
    <Navbar variant="dark" style={{ backgroundColor: backgroundColor }}>
      <Nav className="mr-auto main-links">{renderNavLinks}</Nav>
      <Link className="navbar-brand" to="/">
        <div
          className="navbar-brand-logo"
          style={{
            backgroundImage: `url(${logoPath})`,
          }}
          alt="logo"
        />
        <span>Notes</span>
      </Link>
      <Nav className="right-side-links">
        {user.data ? (
          // FIGURE OUT ABOUT BEST WAY OF PROFILE DROPDOWN
          <NavDropdown
            className="profile-links"
            title={<span className="material-icons">account_circle</span>}
            id="nav-dropdown"
          >
            <NavDropdown.Item onClick={() => history.push("/profile")}>
              {user.data.email}
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
