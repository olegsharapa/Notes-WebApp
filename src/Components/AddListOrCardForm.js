import React, { useState, useContext, useRef } from "react";
import { Button } from "react-bootstrap";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import ClickOutside from "./ClickOutside";

export default function AddListOrCardForm({ boardId, listId }) {
  const [newField, setNewField] = useState("");
  const { board } = useContext(FirebaseContext);

  const showFormButtonEl = useRef();
  const formEl = useRef();
  const inputEl = useRef();

  const openForm = () => {
    showFormButtonEl.current.style.display = "none";
    formEl.current.style.display = "block";
    inputEl.current.select();
  };
  const closeForm = () => {
    formEl.current.style.display = "none";
    showFormButtonEl.current.style.display = "flex";
  };

  const onCommandEnterPress = (e) => {
    if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
      formEl.current.dispatchEvent(new Event("submit", { cancelable: true }));
    } else if (e.keyCode === 27) closeForm();
  };

  const addList = (e) => {
    e.preventDefault();
    if (newField.trim()) {
      listId === undefined
        ? board.list.add(boardId, newField)
        : board.card.add(boardId, listId, newField);
      closeForm();
      setNewField("");
    } else {
      inputEl.current.focus();
    }
  };

  let showFormButtonPlaceholder,
    showFormButtonStyle,
    formStyle,
    submitButtonPlaceholder,
    newFieldInput;

  if (listId !== undefined) {
    showFormButtonPlaceholder = `Add ${
      board.data.lists[listId].cardOrder.length ? "another card" : "a card"
    }`;
    showFormButtonStyle = "add-card-button";
    formStyle = "add-card-form";
    submitButtonPlaceholder = "Add Card";
    newFieldInput = (
      <textarea
        type="text"
        style={{
          border: "none",
          boxShadow: "0 1px 0 rgba(9,30,66,.25)",
          resize: "none",
        }}
        className="form-control"
        placeholder="Enter a title for this card..."
        value={newField}
        onChange={(e) => setNewField(e.target.value)}
        onKeyDown={onCommandEnterPress}
        ref={inputEl}
        maxLength={512}
      />
    );
  } else {
    showFormButtonPlaceholder = `Add ${
      Object.keys(board.data.lists).length ? "another list" : "a list"
    }`;
    showFormButtonStyle = "add-list-button";
    formStyle = "add-list-form";
    submitButtonPlaceholder = "Add List";
    newFieldInput = (
      <input
        type="text"
        style={{ border: "none", boxShadow: "inset 0 0 0 2px #0079bf" }}
        className="form-control"
        placeholder="List title..."
        value={newField}
        onChange={(e) => setNewField(e.target.value)}
        onKeyDown={onCommandEnterPress}
        ref={inputEl}
        maxLength={512}
      />
    );
  }

  return (
    <ClickOutside onClick={closeForm}>
      <div>
        <button
          type="button"
          className={`unstyled-button ${showFormButtonStyle}`}
          onClick={openForm}
          ref={showFormButtonEl}
        >
          <span className="material-icons add-icon">add</span>
          {showFormButtonPlaceholder}
        </button>
        <form
          className={formStyle}
          onSubmit={addList}
          ref={formEl}
          style={{ display: "none" }}
        >
          {newFieldInput}
          <div className="add-list-form-buttons">
            <Button
              variant="success"
              size="sm"
              type="submit"
              style={{ marginRight: "5px" }}
            >
              {submitButtonPlaceholder}
            </Button>
            <button
              className="unstyled-button"
              type="button"
              onClick={closeForm}
            >
              <span className="material-icons add-list-close-icon">close</span>
            </button>
          </div>
        </form>
      </div>
    </ClickOutside>
  );
}
