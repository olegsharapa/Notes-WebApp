import React, { useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import BackgroundsPicker from "./BackgroundsPicker";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

export default function ModalAddBoard() {
  const { notes } = useContext(FirebaseContext);
  const [show, setShow] = useState(false);
  const [background, setBackground] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const inputEl = useRef();
  let history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setTimeout(() => {
      inputEl.current.select();
    }, 0);
  };

  const addNewBoard = async (e) => {
    e.preventDefault();
    let board = await notes.addBoard(
      newBoardTitle,
      background,
      setNewBoardTitle
    );
    handleClose();
    history.push(`/b/${board}`);
  };

  return (
    <>
      <div onClick={handleShow} className="modal-add-board">
        <p>Create New Board</p>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="create-board-container"
      >
        <Modal.Body className="create-board-body">
          <form className="" onSubmit={addNewBoard}>
            <div
              className="create-board-tile"
              style={{
                backgroundImage: `url(${
                  background ? background.urls.small : null
                })`,
              }}
            >
              <button
                className="unstyled-button modal-close-button"
                type="button"
                onClick={handleClose}
              >
                <span className="material-icons md-light md-18">close</span>
              </button>
              <input
                type="text"
                placeholder="Board name"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                autoFocus={true}
                ref={inputEl}
              />
            </div>
            <div style={{ display: "flex" }}>
              <Button
                variant="light"
                type="submit"
                className={`modal-add-board-button${
                  newBoardTitle.trim() ? "" : " disabled"
                }`}
                disabled={!newBoardTitle.trim()}
              >
                New Board
              </Button>
              <BackgroundsPicker
                background={background}
                setBackground={setBackground}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
