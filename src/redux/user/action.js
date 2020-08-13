import { ADD_USER, REMOVE_USER } from "./actionType";

export function addUser(data) {
  localStorage.setItem("mobchat_token", data.token);
  return {
    type: ADD_USER,
    payload: data,
  };
}

export function removeUser(data) {
  localStorage.removeItem("mobchat_token");
  return {
    type: REMOVE_USER,
    payload: data,
  };
}
