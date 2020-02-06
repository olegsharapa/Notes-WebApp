import React from "react";

export default function About() {
  return (
    <div className="jumbotron jumbotron-fluid">
      <div className="container">
        <h1 className="display-6">About app</h1>
        <p className="lead">
          This is an App for time management.
          <br />
          Created on React using new feature React Hooks.
          <br />
          You can add, delete and mark as complete Todos. Also you have an alert
          for whole process with close button and closing timer.
        </p>
        <hr className="my-4" />
        <span>Version App: 1.0.1</span>
      </div>
    </div>
  );
}
