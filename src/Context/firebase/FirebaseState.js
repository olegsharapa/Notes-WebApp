import React, { useReducer, useContext } from "react";
import { firebaseReducer } from "./firebaseReducer";
import { FirebaseContext } from "./firebaseContext";
import {
  SHOW_LOADER,
  FETCH_NOTES,
  ADD_NOTE,
  REMOVE_NOTE,
  TOGGLE_NOTE
} from "./firebaseActions";
import axios from "axios";
import { AlertContext } from "../alert/alertContext";

const url = process.env.REACT_APP_DB_URL;

export const FirebaseState = ({ children }) => {
  const alert = useContext(AlertContext);
  const initialState = {
    notes: [],
    loading: false
  };
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  const errMessage = err => {
    alert.show("Something went wrong. (" + err.message + ")", "danger");
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  const fetchNotes = async () => {
    showLoader();
    await axios
      .get(`${url}/notes.json`)
      .then(res => {
        let payload = [];
        if (res.data !== null) {
          payload = Object.keys(res.data).map(key => {
            return { id: key, ...res.data[key] };
          });
        }
        dispatch({ type: FETCH_NOTES, payload });
      })
      .catch(err => {
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
      date: new Date().toJSON()
    };
    await axios
      .post(`${url}/notes.json`, note)
      .then(res => {
        clearForm("");
        let payload = {
          id: res.data.name,
          ...note
        };
        dispatch({ type: ADD_NOTE, payload });
        alert.show("Note has been added", "success");
      })
      .catch(err => {
        errMessage(err);
        console.error("ERROR FROM POST NOTE FUNC ", err);
      });
  };

  const toggleNote = async note => {
    const { id, title, complete, date } = note;
    const params = { title, complete: !complete, date };
    const payload = { id, ...params };
    await axios
      .put(`${url}/notes/${note.id}.json`, params)
      .then(response => {
        dispatch({ type: TOGGLE_NOTE, payload });
        console.log(response);
      })
      .catch(err => {
        errMessage(err);
        console.log("ERROR FROM TOGGLE FUNC ", err);
      });
  };

  const removeNote = async id => {
    await axios
      .delete(`${url}/notes/${id}.json`)
      .then(res => {
        dispatch({ type: REMOVE_NOTE, payload: id });
        alert.show("Note has been deleted", "success");
      })
      .catch(err => {
        errMessage(err);
        console.log("ERROR FROM REMOVE FUNC ", err);
      });
  };

  return (
    <FirebaseContext.Provider
      value={{
        fetchNotes,
        toggleNote,
        postNote,
        removeNote,
        notes: state.notes,
        loading: state.loading
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
