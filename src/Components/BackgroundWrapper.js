import React, { useContext } from "react";
import Navbar from "../Components/Navbar";
import { hexToRgb } from "../Utils/colorConverter";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import { useRouteMatch } from "react-router-dom";

export default function BackgroundWrapper({ children }) {
  const { notes } = useContext(FirebaseContext);
  let match = useRouteMatch("/b");
  let backgroundImage, backgroundColor;
  if (notes.board.background && match) {
    backgroundImage = `url(${notes.board.background.urls.full})`;
    backgroundColor =
      notes.board.background.color &&
      hexToRgb(notes.board.background.color, 0.32);
  }
  return (
    <div className="wrapper" style={{ backgroundImage: backgroundImage }}>
      <Navbar backgroundColor={backgroundColor} />
      {children}
    </div>
  );
}
