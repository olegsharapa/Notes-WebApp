import React from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import Home from "./Views/Home";
import About from "./Views/About";
import Alert from "./Components/Alert";
import { FirebaseState } from "./Context/firebase/FirebaseState";
import { AlertState } from "./Context/alert/AlertState";

export default function App() {
  return (
    <AlertState>
      <FirebaseState>
        <BrowserRouter>
          <nav className="navbar navbar-dark navbar-expand-sm bg-primary">
            <div className="navbar-brand">Note App</div>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" exact>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="wrapper">
            <Alert />
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/about">
                <About />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </FirebaseState>
    </AlertState>
  );
}
