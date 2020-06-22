import React from "react";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Alert from "../Components/Alert";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import routes from "./routes";
import { PrivateRoute, PublicRoute } from "./helpers";

export default function Routes() {
  const renderSwitch = (
    <Switch>
      {routes.map((route) =>
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
      <BackgroundWrapper>
        <Alert />
        {renderSwitch}
      </BackgroundWrapper>
    </BrowserRouter>
  );
}
