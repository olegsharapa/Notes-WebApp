import React, { useContext } from "react";
import TodoItem from "./TodoItem";
import { FirebaseContext } from "../Context/firebase/firebaseContext";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function TodoList() {
  const { notes } = useContext(FirebaseContext);
  const content = notes.length ? (
    notes.map((todo, i) => (
      <CSSTransition key={todo.id} classNames={"note"} timeout={600}>
        <TodoItem todo={todo} index={i + 1} />
      </CSSTransition>
    ))
  ) : (
    <CSSTransition classNames={"note"} timeout={600}>
      <p>Congratulations! You have no more things to do today, take a rest!</p>
    </CSSTransition>
  );

  return (
    <TransitionGroup component="ul" className="list-group">
      {content}
    </TransitionGroup>
  );
}
