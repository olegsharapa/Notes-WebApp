import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

function TodoItem({ todo, index }) {
  const { notes } = useContext(FirebaseContext);

  return (
    <React.Fragment>
      <li className={"list-group-item note"}>
        <span className={todo.complete ? "done" : null}>
          <input
            type="checkbox"
            style={{ marginRight: ".5rem" }}
            checked={todo.complete}
            onChange={() => notes.toggle(todo)}
          />
          <strong>{index}</strong>
          <strong>{todo.title}</strong>
          <small>{new Date(todo.date).toLocaleString()}</small>
        </span>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => notes.remove(todo.id)}
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
