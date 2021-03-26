import { SET_LOADING } from "../actions/actionTypes";
import { combineReducers } from "redux";

const initialState = true;

const loading = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({ loading });

