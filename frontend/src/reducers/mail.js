import { SET_NEW_MAIL } from "../actions/actionTypes";
import { combineReducers } from "redux";

const initialState = [];

const newMail = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_MAIL: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({ newMail });

