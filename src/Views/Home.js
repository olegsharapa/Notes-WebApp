import React, { useContext } from "react";
import Loading from "../Components/Loading";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import BoardsList from "../Components/BoardsList";

export default function Home() {
  const { notes, loading } = useContext(FirebaseContext);

  React.useEffect(() => {
    notes.fetchBoards();
    //eslint-disable-next-line
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="boards-list-wrapper">
      <BoardsList />
    </div>
  );
}
