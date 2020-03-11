import React, { createContext, useReducer, useContext, useEffect } from "react";
import { firebaseReducer } from "./firebaseReducer";
import {
  SHOW_LOADER,
  FETCH_NOTES,
  ADD_NOTE,
  REMOVE_NOTE,
  TOGGLE_NOTE,
  SET_USER,
  REMOVE_USER
} from "./firebaseActions";
import axios from "axios";
import { AlertContext } from "../alert/alertContext";
import database from "../../API/firebase";

const databaseUrl = process.env.REACT_APP_DB_URL;

const FirebaseContext = createContext();

const FirebaseState = ({ children }) => {
  const initialState = {
    notes: [],
    user: null,
    loading: false
  };

  let user = JSON.parse(localStorage.getItem("user"));

  const [state, dispatch] = useReducer(firebaseReducer, {
    ...initialState,
    user
  });

  const alert = useContext(AlertContext);

  const errMessage = err => {
    alert.show(`Something went wrong. (${err.message})`, "danger");
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  //GET USER OBJECT ON INITIALISE
  useEffect(() => {
    database.auth().onAuthStateChanged(setUser);
  }, []);
  const setUser = user => {
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
      .then(res => {
        console.log("res is: ", res);
        dispatch({ type: SET_USER, payload: res.user });
      })
      .catch(err => {
        errMessage(err);
        console.log("ERROR FROM SIGN UP ", err);
      });
  };

  const signIn = (email, password) => {
    showLoader();
    database
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        dispatch({ type: SET_USER, payload: res.user });
      })
      .catch(err => {
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
      .catch(err => {
        errMessage(err);
        console.log("ERROR FROM SIGN OUT ", err);
      });
  };

  const updatePassword = password => {
    var user = database.auth().currentUser;
    user
      .updatePassword(password)
      .then(() => {
        alert.show("Password has been updated", "success");
      })
      .catch(err => {
        errMessage(err);
        console.log("ERROR FROM UPDATE PASSWORD ", err);
      });
    console.log("user from updatePassword: ", user);
  };

  const updateEmail = email => {
    var user = database.auth().currentUser;
    user
      .updateEmail(email)
      .then(() => {
        alert.show("Email has been updated", "success");
      })
      .catch(err => {
        errMessage(err);
        console.log("error ", err);
      });
    console.log("user from updateEmail: ", user);
    dispatch({ type: SET_USER, payload: user });
    setUser(user);
  };

  //NOTES LOGIC
  const fetchNotes = () => {
    showLoader();
    axios
      .get(`${databaseUrl}/notes.json`)
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
      .post(`${databaseUrl}/notes.json`, note)
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
      .put(`${databaseUrl}/notes/${note.id}.json`, params)
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
      .delete(`${databaseUrl}/notes/${id}.json`)
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
        notes: {
          fetch: fetchNotes,
          toggle: toggleNote,
          add: postNote,
          remove: removeNote,
          data: state.notes
        },
        user: {
          data: state.user,
          signIn,
          signUp,
          signOut,
          updatePassword,
          updateEmail
        },
        loading: state.loading
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseState };
