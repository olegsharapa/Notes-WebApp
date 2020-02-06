import React, { useContext } from "react";
import { AlertContext } from "../Context/alert/alertContext";
import { CSSTransition } from "react-transition-group";

export default function Alert() {
  const { alert, hide } = useContext(AlertContext);
  return (
    <CSSTransition
      in={alert.visible}
      timeout={{
        enter: 500,
        exit: 0
      }}
      classNames={"alert"}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={`alert alert-${alert.type || "warning"} alert-dismissible`}
        style={{ margin: "1rem 0", border: "none" }}
      >
        <strong>
          {alert.type
            ? alert.type[0].toUpperCase() + alert.type.slice(1) + "! "
            : "Warning! "}
        </strong>
        {alert.text}
        <button
          type="button"
          className="close"
          aria-label="Close"
          data-dismiss="alert"
          onClick={() => hide()}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </CSSTransition>
  );
}
