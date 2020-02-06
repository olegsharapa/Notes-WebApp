import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "../Context/firebase/firebaseContext";

function TodoItem({ todo, index }) {
  const { toggleNote, removeNote } = useContext(FirebaseContext);

  return (
    <React.Fragment>
      <li className={"list-group-item note"}>
        <span className={todo.complete ? "done" : null}>
          <input
            type="checkbox"
            style={{ marginRight: ".5rem" }}
            checked={todo.complete}
            onChange={() => toggleNote(todo)}
          />
          <strong>{index}</strong>
          &nbsp;
          <strong>{todo.title}</strong>
          <small>{new Date(todo.date).toLocaleString()}</small>
        </span>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => removeNote(todo.id)}
        >
          &times;
        </button>
      </li>
    </React.Fragment>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default TodoItem;
