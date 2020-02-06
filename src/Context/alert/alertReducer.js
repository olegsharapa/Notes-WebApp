import { SHOW_ALERT, HIDE_ALERT } from "./alertActions";

const handlers = {
  DEFAULT: state => state,
  [SHOW_ALERT]: (state, { payload }) => ({ ...payload, visible: true }),
  [HIDE_ALERT]: state => ({ visible: false })
};

export const alertReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};
