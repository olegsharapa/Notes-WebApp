import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Alert from "../Components/Alert";
import routes from "./Routes";
import { PrivateRoute, PublicRoute } from "./Helpers";

export default function Routes() {
  const renderSwitch = () => (
    <Switch>
      {routes.map(route =>
        route.isPrivate ? (
          <PrivateRoute
            key={route.path}
            path={route.path}
            exact={route.isExact}
            component={route.component}
          />
        ) : route.isPublic ? (
          <PublicRoute
            key={route.path}
            path={route.path}
            exact={route.isExact}
            component={route.component}
          />
        ) : (
          <Route
            key={route.path}
            path={route.path}
            exact={route.isExact}
            component={route.component}
          />
        )
      )}
    </Switch>
  );
  return (
    <BrowserRouter>
      <Navbar routes={routes.filter(route => route.isNavBar)} />
      <div className="wrapper">
        <Alert />
        {renderSwitch()}
      </div>
    </BrowserRouter>
  );
}
