import {
  SHOW_LOADER,
  ADD_NOTE,
  FETCH_NOTES,
  REMOVE_NOTE,
  TOGGLE_NOTE
} from "./firebaseActions";

const handlers = {
  [SHOW_LOADER]: state => ({ ...state, loading: true }),
  [ADD_NOTE]: (state, { payload }) => ({
    ...state,
    notes: [...state.notes, payload]
  }),
  [FETCH_NOTES]: (state, { payload }) => ({
    ...state,
    notes: payload,
    loading: false
  }),
  [TOGGLE_NOTE]: (state, { payload }) => {
    let notes = state.notes.map(note => {
      if (note.id === payload.id) {
        return payload;
      } else {
        return note;
      }
    });
    return {
      ...state,
      notes: notes
    };
  },
  [REMOVE_NOTE]: (state, { payload }) => ({
    ...state,
    notes: state.notes.filter(note => note.id !== payload)
  }),
  DEFAULT: state => state
};

export const firebaseReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};
