import {SAVE_NEW_MESSAGE, FETCH_MESSAGES, LOAD_ALL_USERS} from "../actions/actionTypes";

const initialState = {
  messages: [],
  users: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MESSAGES:
      return {...state, messages: action.messages};
    case SAVE_NEW_MESSAGE:
      let messages = [...state.messages];
      messages.push(action.message);
      return {...state, messages};
    case LOAD_ALL_USERS:

      return {...state, users: action.users};
    default:
      return state;
  }
};

export default reducer;