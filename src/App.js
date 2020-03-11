import React from "react";
import Routes from "./Router";
import { FirebaseState } from "./Context/firebase/FirebaseState";
import { AlertState } from "./Context/alert/AlertState";

export default function App() {
  return (
    <AlertState>
      <FirebaseState>
        <Routes />
      </FirebaseState>
    </AlertState>
  );
}
