import React, { useState, useContext } from "react";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

export default function AddTodo() {
  const [newTodo, setNewTodo] = useState("");
  const { notes } = useContext(FirebaseContext);

  const addNote = e => {
    e.preventDefault();
    notes.add(newTodo, setNewTodo);
  };

  return (
    <form className="input-group mb-3" onSubmit={addNote}>
      <input
        type="text"
        className="form-control"
        placeholder="Todo name"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
      />
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="submit">
          Add todo
        </button>
      </div>
    </form>
  );
}
