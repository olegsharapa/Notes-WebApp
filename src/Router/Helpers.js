import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useContext(FirebaseContext);
  return (
    <Route
      {...rest}
      render={props =>
        user.data ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function PublicRoute({ component: Component, ...rest }) {
  const { user } = useContext(FirebaseContext);
  return (
    <Route
      {...rest}
      render={props =>
        user.data ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export { PrivateRoute, PublicRoute };
