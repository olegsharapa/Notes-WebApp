import React, { useContext } from "react";
import TodoItem from "./TodoItem";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function TodoList() {
  const { notes } = useContext(FirebaseContext);
  // console.log("boards state ", notes.boards);

  const todoItems = notes.data.length ? (
    notes.data.map((todo, i) => (
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
      {todoItems}
    </TransitionGroup>
  );
}
