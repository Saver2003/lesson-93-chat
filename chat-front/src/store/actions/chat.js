import {FETCH_MESSAGES, SAVE_NEW_MESSAGE, LOAD_ALL_USERS, DELETE_MESSAGE} from "./actionTypes";

export const loadMessages = messages => {
  return {type: FETCH_MESSAGES, messages};
};

export const saveMessage = (message) => {
  return {type: SAVE_NEW_MESSAGE, message};
};

export const loadAllUsers = (users) => {
  return {type: LOAD_ALL_USERS, users}
};

export const deleteMessage = (message) => {
  return {type: DELETE_MESSAGE, message}
};