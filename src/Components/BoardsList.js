import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import { AlertContext } from "../Context/alert/alertContext";
import ModalAddBoard from "./ModalAddBoard";
import Loading from "./Loading";

export default function BoardsList() {
  const { notes, loading } = useContext(FirebaseContext);
  const { alert } = useContext(AlertContext);

  const boards = notes.boards.map((boardItem) => (
    <li key={boardItem.id} className="boards-list-item">
      <Link
        to={`b/${boardItem.id}`}
        className="boards-list-tile"
        style={
          boardItem.background
            ? { backgroundImage: `url(${boardItem.background.urls.small})` }
            : null
        }
      >
        {boardItem.title}
      </Link>
    </li>
  ));

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {!alert.visible ? <h2>Boards</h2> : null}
      <ul className="boards-list-container">
        {boards}
        <li key="addBoard" className="boards-list-item">
          <ModalAddBoard />
        </li>
      </ul>
    </>
  );
}
