import React, { createContext, useReducer, useContext, useEffect } from "react";
import { firebaseReducer } from "./firebaseReducer";
import {
  SHOW_LOADER,
  FETCH_NOTES,
  ADD_NOTE,
  REMOVE_NOTE,
  TOGGLE_NOTE,
  SET_USER,
  REMOVE_USER,
  FETCH_BOARDS,
  FETCH_BOARD,
  ADD_BOARD,
  DELETE_BOARD,
  ADD_LIST,
  ADD_CARD,
  DELETE_CARD,
} from "./firebaseActions";
import axios from "axios";
import { AlertContext } from "../alert/alertContext";
import database from "../../Config/firebase";

const databaseUrl = process.env.REACT_APP_DB_URL;

const FirebaseContext = createContext();

const FirebaseState = ({ children }) => {
  const initialState = {
    notes: [],
    boards: [],
    board: {
      loaded: false,
      exists: false,
      listOrder: [],
      lists: {},
      cards: {},
    },
    user: null,
    loading: false,
  };

  let user = JSON.parse(localStorage.getItem("user"));

  const [state, dispatch] = useReducer(firebaseReducer, {
    ...initialState,
    user,
  });
  // console.log("STATE ", state);
  console.log("BOARD ", state.board);

  const alert = useContext(AlertContext);

  const errMessage = (err) => {
    alert.show(`Something went wrong. (${err.message})`, "danger");
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  //GET USER OBJECT ON INITIALISE
  useEffect(() => {
    database.auth().onAuthStateChanged(setUser);
  }, []);
  const setUser = (user) => {
    if (user) {
      dispatch({ type: SET_USER, payload: user });
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      dispatch({ type: REMOVE_USER });
      localStorage.removeItem("user");
    }
  };

  //USER LOGIC
  const signUp = (email, password) => {
    database
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("res is: ", res);
        dispatch({ type: SET_USER, payload: res.user });
      })
      .catch((err) => {
        errMessage(err);
        console.log("ERROR FROM SIGN UP ", err);
      });
  };

  const signIn = (email, password) => {
    showLoader();
    database
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        dispatch({ type: SET_USER, payload: res.user });
      })
      .catch((err) => {
        errMessage(err);
        dispatch({ type: SET_USER, payload: null });
        console.log("ERROR FROM SIGN IN ", err);
      });
  };

  const signOut = () => {
    showLoader();
    database
      .auth()
      .signOut()
      .then(() => dispatch({ type: REMOVE_USER }))
      .catch((err) => {
        errMessage(err);
        console.log("ERROR FROM SIGN OUT ", err);
      });
  };

  const updatePassword = (password) => {
    var user = database.auth().currentUser;
    user
      .updatePassword(password)
      .then(() => {
        alert.show("Password has been updated", "success");
      })
      .catch((err) => {
        errMessage(err);
        console.log("ERROR FROM UPDATE PASSWORD ", err);
      });
    console.log("user from updatePassword: ", user);
  };

  const updateEmail = (email) => {
    var user = database.auth().currentUser;
    user
      .updateEmail(email)
      .then(() => {
        alert.show("Email has been updated", "success");
      })
      .catch((err) => {
        errMessage(err);
        console.log("error ", err);
      });
    console.log("user from updateEmail: ", user);
    dispatch({ type: SET_USER, payload: user });
    setUser(user);
  };

  //NEW VORSION OF NOTES LOGIC
  const boardsRef = database.firestore().collection("boards");

  const fetchBoards = () => {
    showLoader();
    boardsRef
      .where(`users.${state.user.uid}`, ">", "")
      .get()
      .then((querySnapshot) => {
        const payload = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: FETCH_BOARDS, payload });
      })
      .catch((err) => {
        console.log("Database error ", err);
        dispatch({ type: FETCH_BOARDS, payload: [] });
      });
  };

  const fetchBoard = async (boardId) => {
    dispatch({
      type: FETCH_BOARD,
      payload: initialState.board,
    });
    showLoader();
    const boardRef = boardsRef.doc(boardId);
    let fetchBoard = boardRef.get();
    let fetchLists = boardRef.collection(`lists`).get();
    let fetchCards = boardRef.collection(`cards`).get();
    await Promise.all([fetchBoard, fetchLists, fetchCards]).then((values) => {
      const board = {
        id: values[0].id,
        ...values[0].data(),
        exists: values[0].exists,
        lists: {},
        cards: {},
      };
      values[1].docs.map(
        (list) =>
          (board.lists = {
            ...board.lists,
            [list.id]: {
              id: list.id,
              ...list.data(),
            },
          })
      );
      values[2].docs.map(
        (card) =>
          (board.cards = {
            ...board.cards,
            [card.id]: {
              id: card.id,
              ...card.data(),
            },
          })
      );
      dispatch({
        type: FETCH_BOARD,
        payload: {
          ...board,
          loaded: true,
        },
      });
    });
  };

  const updateBoard = (boardId, content) => {
    dispatch({
      type: FETCH_BOARD,
      payload: { ...state.board, ...content },
    });
    boardsRef
      .doc(boardId)
      .update(content)
      .then(() => console.log("Board updated ", content))
      .catch((err) => {
        alert.show(`Database error: ${err}`, "danger");
        console.log(err);
      });
  };

  const deleteBoard = async (boardId) => {
    await boardsRef
      .doc(boardId)
      .delete()
      .then(() => {
        console.log(`board ${boardId} was deleted`);
        dispatch({ type: DELETE_BOARD, payload: boardId });
      })
      .catch((err) => {
        alert.show(`Database error: ${err}`, "danger");
        console.log(err);
      });
  };

  const addBoard = (title, background, clearForm) => {
    if (!title.trim()) {
      alert.show("Type a name of new Board");
      return;
    }
    const board = {
      title,
      background,
      listOrder: [],
      date: new Date().toJSON(),
      users: { [user.uid]: "Admin" },
    };
    let boardId = boardsRef
      .add(board)
      .then((res) => {
        dispatch({ type: ADD_BOARD, payload: { id: res.id, ...board } });
        clearForm("");
        alert.show("Board successfully added!", "success");
        return res.id;
      })
      .catch((err) => alert.show(`Database error: ${err}`, "danger"));
    return boardId;
  };

  const addList = (boardId, title) => {
    const list = {
      title,
      cardOrder: [],
      date: new Date().toJSON(),
    };
    const boardRef = boardsRef.doc(boardId);
    boardRef
      .collection("lists")
      .add(list)
      .then((res) => {
        boardRef.update({
          listOrder: database.firestore.FieldValue.arrayUnion(res.id),
        });
        dispatch({
          type: ADD_LIST,
          payload: { id: res.id, ...list },
        });
      })
      .catch((err) => {
        alert.show(`Database error: ${err}`, "danger");
        console.log(err);
      });
  };

  const updateList = (boardId, ...lists) => {
    let newLists = {};
    let batch = database.firestore().batch();
    for (let list of lists) {
      newLists[list.id] = { ...list };
      let listRef = boardsRef.doc(`${boardId}/lists/${list.id}`);
      delete list.id;
      batch.update(listRef, list);
    }
    dispatch({
      type: FETCH_BOARD,
      payload: {
        ...state.board,
        lists: {
          ...state.board.lists,
          ...newLists,
        },
      },
    });
    batch
      .commit()
      .then(() => console.log("list updated", lists))
      .catch((err) => {
        alert.show(`Database error: ${err}`, "danger");
        fetchBoard(boardId);
        console.error(err);
      });
  };

  const deleteList = (boardId, listId, listCards) => {
    const boardRef = boardsRef.doc(boardId);
    boardRef
      .collection("lists")
      .doc(listId)
      .delete()
      .then(() => {
        boardRef.update({
          listOrder: database.firestore.FieldValue.arrayRemove(listId),
        });
        dispatch({ type: "DELETE_LIST", payload: listId });
        if (listCards) {
          listCards.map((cardId) => deleteCard(boardId, false, cardId));
        }
        alert.show("List successfully deleted!", "success");
      })
      .catch((err) => {
        alert.show(`Database error: ${err}`, "danger");
        console.log(err);
      });
  };

  const addCard = (boardId, listId, title) => {
    const boardRef = boardsRef.doc(boardId);
    const card = {
      title,
      date: new Date().toJSON(),
    };
    boardRef
      .collection("cards")
      .add(card)
      .then((res) => {
        boardRef
          .collection("lists")
          .doc(listId)
          .update({
            cardOrder: database.firestore.FieldValue.arrayUnion(res.id),
          });
        dispatch({
          type: ADD_CARD,
          payload: { card: { id: res.id, ...card }, list: listId },
        });
      })
      .catch((err) => {
        alert.show(`Database error: ${err}`, "danger");
        console.log(err);
      });
  };

  const deleteCard = (boardId, listId, cardId) => {
    const boardRef = boardsRef.doc(boardId);
    boardRef
      .collection("cards")
      .doc(cardId)
      .delete()
      .then(() => {
        if (listId) {
          boardRef
            .collection("lists")
            .doc(listId)
            .update({
              cardOrder: database.firestore.FieldValue.arrayRemove(cardId),
            });
          dispatch({ type: DELETE_CARD, payload: { cardId, listId } });
        }
        console.log("Card ", cardId, " was deleted");
      })
      .catch((err) => {
        alert.show(`Database error: ${err}`, "danger");
        console.log(err);
      });
  };

  //OLD VERSION OF NOTES LOGIC
  const fetchNotes = () => {
    showLoader();
    axios
      .get(`${databaseUrl}/notes.json`)
      .then((res) => {
        let payload = [];
        if (res.data !== null) {
          payload = Object.keys(res.data).map((key) => {
            return { id: key, ...res.data[key] };
          });
        }
        dispatch({ type: FETCH_NOTES, payload });
      })
      .catch((err) => {
        errMessage(err);
        dispatch({ type: FETCH_NOTES, payload: [] });
        console.error("ERROR FROM FETCH NOTES FUNC ", err);
      });
  };

  const postNote = async (title, clearForm) => {
    if (!title.trim()) {
      alert.show("Type a name of Todo");
      return;
    }
    const note = {
      title,
      complete: false,
      date: new Date().toJSON(),
    };
    await axios
      .post(`${databaseUrl}/notes.json`, note)
      .then((res) => {
        clearForm("");
        let payload = {
          id: res.data.name,
          ...note,
        };
        dispatch({ type: ADD_NOTE, payload });
        alert.show("Note has been added", "success");
      })
      .catch((err) => {
        errMessage(err);
        console.error("ERROR FROM POST NOTE FUNC ", err);
      });
  };

  const toggleNote = (note) => {
    const { id, title, complete, date } = note;
    const params = { title, complete: !complete, date };
    const payload = { id, ...params };
    axios
      .put(`${databaseUrl}/notes/${note.id}.json`, params)
      .then((response) => {
        dispatch({ type: TOGGLE_NOTE, payload });
        console.log(response);
      })
      .catch((err) => {
        errMessage(err);
        console.log("ERROR FROM TOGGLE FUNC ", err);
      });
  };

  const removeNote = (id) => {
    axios
      .delete(`${databaseUrl}/notes/${id}.json`)
      .then(() => {
        dispatch({ type: REMOVE_NOTE, payload: id });
        alert.show("Note has been deleted", "success");
      })
      .catch((err) => {
        errMessage(err);
        console.log("ERROR FROM REMOVE FUNC ", err);
      });
  };

  return (
    <FirebaseContext.Provider
      value={{
        board: {
          fetch: fetchBoard,
          data: state.board,
          update: updateBoard,
          delete: deleteBoard,
          list: {
            add: addList,
            update: updateList,
            delete: deleteList,
          },
          card: {
            add: addCard,
            delete: deleteCard,
          },
        },
        notes: {
          fetch: fetchNotes,
          fetchBoards,
          toggle: toggleNote,
          add: postNote,
          remove: removeNote,
          data: state.notes,
          boards: state.boards,
          board: state.board,
          addBoard,
          addList,
          deleteList,
          addCard,
        },
        user: {
          data: state.user,
          signIn,
          signUp,
          signOut,
          updatePassword,
          updateEmail,
        },
        loading: state.loading,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseState };
