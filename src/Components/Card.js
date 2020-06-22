import React, { useRef, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
import { FirebaseContext } from "../Context/firebase/FirebaseState";

export default function Card({ listId, card, index }) {
  const cardRef = useRef();
  let location = useLocation();
  let boardId = location.pathname.slice(3);
  const { board } = useContext(FirebaseContext);
  return (
    <Draggable draggableId={card.id} index={index} type="cards">
      {(provided) => (
        <div
          className="list-card-wrapper"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => (cardRef.current.className = "list-card active")}
          onMouseLeave={() => (cardRef.current.className = "list-card")}
        >
          <div ref={cardRef} className="list-card">
            {card.title}
            <button
              className="unstyled-button edit-button"
              type="button"
              onClick={() => board.card.delete(boardId, listId, card.id)}
            >
              <span className="material-icons md-14">close</span>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
