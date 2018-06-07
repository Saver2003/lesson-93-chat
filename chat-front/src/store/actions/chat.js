import {FETCH_MESSAGES, SAVE_NEW_MESSAGE} from "./actionTypes";

export const loadMessages = messages => {
  return {type: FETCH_MESSAGES, messages};
};

export const saveMessage = (message) => {
  return {type: SAVE_NEW_MESSAGE, message};
};