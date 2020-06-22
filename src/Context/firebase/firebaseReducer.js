import {
  SHOW_LOADER,
  ADD_NOTE,
  FETCH_NOTES,
  REMOVE_NOTE,
  TOGGLE_NOTE,
  SET_USER,
  REMOVE_USER,
  FETCH_BOARDS,
  FETCH_BOARD,
  ADD_BOARD,
  ADD_LIST,
  DELETE_LIST,
  ADD_CARD,
  DELETE_CARD,
  DELETE_BOARD,
} from "./firebaseActions";

const handlers = {
  [SHOW_LOADER]: (state) => ({ ...state, loading: true }),
  [ADD_NOTE]: (state, { payload }) => ({
    ...state,
    notes: [...state.notes, payload],
  }),
  [FETCH_NOTES]: (state, { payload }) => ({
    ...state,
    notes: payload,
    loading: false,
  }),
  [TOGGLE_NOTE]: (state, { payload }) => {
    let notes = state.notes.map((note) => {
      if (note.id === payload.id) {
        return payload;
      } else {
        return note;
      }
    });
    return {
      ...state,
      notes: notes,
    };
  },
  [REMOVE_NOTE]: (state, { payload }) => ({
    ...state,
    notes: state.notes.filter((note) => note.id !== payload),
  }),
  [SET_USER]: (state, { payload }) => ({
    ...state,
    user: payload,
    loading: false,
  }),
  [REMOVE_USER]: (state) => ({
    ...state,
    user: null,
    loading: false,
  }),
  [FETCH_BOARDS]: (state, { payload }) => ({
    ...state,
    boards: payload,
    loading: false,
  }),
  [ADD_BOARD]: (state, { payload }) => ({
    ...state,
    boards: [...state.boards, payload],
    loading: false,
  }),
  [FETCH_BOARD]: (state, { payload }) => ({
    ...state,
    board: payload,
    loading: false,
  }),
  [DELETE_BOARD]: (state, { payload }) => ({
    ...state,
    boards: state.boards.filter((board) => board.id !== payload),
  }),
  [ADD_LIST]: (state, { payload }) => ({
    ...state,
    board: {
      ...state.board,
      listOrder: [...state.board.listOrder, payload.id],
      lists: { ...state.board.lists, [payload.id]: { ...payload } },
    },
    loading: false,
  }),
  [DELETE_LIST]: (state, { payload }) => {
    let newLists = { ...state.board.lists };
    delete newLists[payload];
    return {
      ...state,
      board: {
        ...state.board,
        listOrder: state.board.listOrder.filter((listId) => listId !== payload),
        lists: newLists,
      },
      loading: false,
    };
  },
  [ADD_CARD]: (state, { payload }) => ({
    ...state,
    board: {
      ...state.board,
      cards: { ...state.board.cards, [payload.card.id]: payload.card },
      lists: {
        ...state.board.lists,
        [payload.list]: {
          ...state.board.lists[payload.list],
          cardOrder: [
            ...state.board.lists[payload.list].cardOrder,
            payload.card.id,
          ],
        },
      },
    },
  }),
  [DELETE_CARD]: (state, { payload }) => {
    let newCards = { ...state.board.cards };
    delete newCards[payload.cardId];
    return {
      ...state,
      board: {
        ...state.board,
        cards: newCards,
        lists: {
          ...state.board.lists,
          [payload.listId]: {
            ...state.board.lists[payload.listId],
            cardOrder: state.board.lists[payload.listId].cardOrder.filter(
              (cardId) => cardId !== payload.cardId
            ),
          },
        },
      },
    };
  },
  DEFAULT: (state) => state,
};

export const firebaseReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};
