import React, { useContext } from "react";
import AddTodo from "../Components/AddTodo";
import TodoList from "../Components/TodoList";
import Loading from "../Components/Loading";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import { AlertContext } from "../Context/alert/alertContext";

export default function Home() {
  const { notes, loading } = useContext(FirebaseContext);
  const { alert } = useContext(AlertContext);

  React.useEffect(() => {
    notes.fetch();
    //eslint-disable-next-line
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      {!alert.visible ? <h2 style={{ margin: "1rem 0" }}>App Tasks</h2> : null}
      <hr />
      <AddTodo />
      <TodoList />
    </React.Fragment>
  );
}
