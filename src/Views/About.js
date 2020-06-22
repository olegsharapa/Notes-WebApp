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
          My goal was to try build something complex backendless without redux
          just with new Hooks API to see how it works.
          <br />
          First of all you have to sign up. Then you can add diferent boards
          with lists and tasks.
          <br />
          I'am added Unsplash widget so now you can change board background.
          <br />
          Also with react-beautiful-dnd now you have drag and drop
          functionality.
        </p>
        <hr className="my-4" />
        <span>Version App: 2.0.1-alpha</span>
      </div>
    </div>
  );
}
