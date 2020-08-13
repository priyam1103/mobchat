import { ADD_USER, REMOVE_USER } from "./actionType";

const initialState = {
  token: null,
  user: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user_,
      };
    case REMOVE_USER:
      return {
        ...state,
        token: null,
        user: {},
      };
    default:
      return state;
  }
};
export default reducer;
