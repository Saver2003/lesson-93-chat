import {SAVE_NEW_MESSAGE, FETCH_MESSAGES, LOAD_ALL_USERS, DELETE_MESSAGE} from "../actions/actionTypes";

const initialState = {
  messages: [],
  users: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_MESSAGE:
      const delMessages = [...state.messages];
      const index = delMessages.findIndex(el => el._id === action.message);
      delMessages.splice(index, 1);
      return {...state, messages: delMessages};
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