import React, { useState, useContext } from "react";
import Card from "./Card";
import AddListOrCardForm from "./AddListOrCardForm";
import TitleInput from "./TitleInput";
import DropdownMenu from "./DropdownMenu";
import { useLocation } from "react-router-dom";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

export default function List({ list, index }) {
  const { board } = useContext(FirebaseContext);
  const [listTitle, setListTitle] = useState(list.title);
  let location = useLocation();
  let boardId = location.pathname.slice(3);
  const cards = list.cardOrder.map((cardId) => board.data.cards[cardId]);

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          className="list-wrapper"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="list-content">
            <div className="list-header" {...provided.dragHandleProps}>
              <TitleInput
                as="textarea"
                defaultValue={list.title}
                value={listTitle}
                onChange={setListTitle}
                onSubmit={() =>
                  board.list.update(boardId, { ...list, title: listTitle })
                }
              />
              <DropdownMenu
                className="extras-list-button"
                title={<span className="material-icons md-18">more_horiz</span>}
                menu={[
                  {
                    title: "Delete List",
                    onClick: () =>
                      board.list.delete(boardId, list.id, list.cardOrder),
                  },
                ]}
              />
            </div>
            <Droppable key={list.id} droppableId={list.id}>
              {(provided, snapshot) => (
                <div
                  className="list-cards"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cards.map((card, index) => (
                    <Card
                      key={card.id}
                      listId={list.id}
                      card={card}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                  {/* Figure out best way to render placeholder */}
                  {/* {provided.placeholder && (
                    <div
                      style={{
                        backgroundColor: "hsla(0, 0%, 0%, 0.1)",
                        marginBottom: snapshot.isDraggingOver ? "8px" : 0,
                        borderRadius: "3px",
                        height: snapshot.isDraggingOver ? "auto" : 0,
                        // transition: "all 3000ms ease-out",
                      }}
                    >
                      {provided.placeholder}
                    </div>
                  )} */}
                </div>
              )}
            </Droppable>
            <div className="list-buttons">
              <AddListOrCardForm boardId={boardId} listId={list.id} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
