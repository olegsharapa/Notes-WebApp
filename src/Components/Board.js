import React, { useState, useContext, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { FirebaseContext } from "../Context/firebase/FirebaseState";
import List from "./List";
import AddListOrCardForm from "./AddListOrCardForm";
import TitleInput from "./TitleInput";
import DropdownMenu from "./DropdownMenu";
import UnsplashWidget from "./UnsplashWidget";
import Loading from "./Loading";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function Board() {
  const [boardName, setBoardName] = useState("");
  const { board, loading } = useContext(FirebaseContext);
  let history = useHistory();
  let boardId = history.location.pathname.slice(3);

  useEffect(() => {
    board.fetch(boardId);
    // FIGURE OUT BEST WAY TO REDIRECT ON ERROR PAGE WHEN BOARD IS NOT FOUND OR WAS DELETED
    // .then(() => {
    //   console.log("BOARD FETCH IF ", !board.data.loaded && !board.data.exists);
    //   if (!board.data.exists) history.replace("/error");
    // });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setBoardName(board.data.title);
  }, [board.data.title]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    if (type === "lists") {
      const newListOrder = [...board.data.listOrder];
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);
      board.update(boardId, { listOrder: newListOrder });
    } else if (source.droppableId !== destination.droppableId) {
      const listFrom = { ...board.data.lists[source.droppableId] };
      const listTo = { ...board.data.lists[destination.droppableId] };
      listFrom.cardOrder.splice(source.index, 1);
      listTo.cardOrder.splice(destination.index, 0, draggableId);
      board.list.update(boardId, listFrom, listTo);
    } else {
      const listWhere = { ...board.data.lists[source.droppableId] };
      listWhere.cardOrder.splice(source.index, 1);
      listWhere.cardOrder.splice(destination.index, 0, draggableId);
      board.list.update(boardId, listWhere);
    }
  };

  const renderColumns = board.data.exists
    ? board.data.listOrder.map((listId, index) => {
        const list = board.data.lists[listId];
        return <List key={list.id} list={list} index={index} />;
      })
    : // <Redirect to="/error" />
      null;

  if (loading) return <Loading />;
  return (
    <main className="main-wrapper">
      <div id="content">
        <div className="board-wrapper">
          <div className="board-main-content">
            <div className="board-header">
              <TitleInput
                as="input"
                defaultValue={board.data.title}
                value={boardName}
                onChange={setBoardName}
                onSubmit={() => board.update(boardId, { title: boardName })}
              />
              <DropdownMenu
                title={<span className="material-icons md-18">more_horiz</span>}
                className="extras-board-button"
                menu={[
                  {
                    title: (
                      <UnsplashWidget
                        title="Change Background"
                        background={board.data.background}
                        setBackground={(background) =>
                          board.update(boardId, { background })
                        }
                      />
                    ),
                  },
                  {
                    title: "Delete Board",
                    onClick: () => {
                      board.delete(boardId).then(() => history.replace("/"));
                    },
                  },
                ]}
              />
            </div>
            <div className="board-canvas">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="all-lists"
                  direction="horizontal"
                  type="lists"
                >
                  {(provided) => (
                    <div
                      className="lists-container"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {renderColumns}
                      {provided.placeholder}
                      <div className="list-wrapper">
                        <AddListOrCardForm boardId={boardId} />
                      </div>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
