import React, { useReducer } from "react";
import { AlertContext } from "./alertContext";
import { alertReducer } from "./alertReducer";
import { HIDE_ALERT, SHOW_ALERT } from "./alertActions";

export const AlertState = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, { visible: false });

  const show = (text, type) => {
    dispatch({ type: SHOW_ALERT, payload: { text, type } });
    setTimeout(hide, 5000);
  };

  const hide = () => {
    dispatch({ type: HIDE_ALERT });
  };

  return (
    <AlertContext.Provider value={{ alert: state, show, hide }}>
      {children}
    </AlertContext.Provider>
  );
};
