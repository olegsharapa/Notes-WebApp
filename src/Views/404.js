import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function ErrorPage() {
  const history = useHistory();
  return (
    <div className="error-page-container">
      <img
        className="error-img"
        src={process.env.PUBLIC_URL + "/404.png"}
        alt="error img"
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          margin: "-50px 0 0 -80px",
        }}
      >
        <Button
          style={{ width: "70px", marginRight: "20px" }}
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        <Link to="/" replace>
          <Button style={{ width: "70px" }}>Home</Button>
        </Link>
      </div>
    </div>
  );
}
