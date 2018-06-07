import {SAVE_NEW_MESSAGE, FETCH_MESSAGES} from "../actions/actionTypes";

const initialState = {
  messages: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MESSAGES:
      return {...state, messages: action.messages};
    case SAVE_NEW_MESSAGE:
      let messages = [...state.messages];
      messages.push(action.message);
      return {...state, messages};
    default:
      return state;
  }
};

export default reducer;