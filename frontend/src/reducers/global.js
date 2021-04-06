import { SET_ERROR, SET_LOADING } from "../actions/actionTypes";
import { combineReducers } from "redux";

const initialState = true;
const initialErrorState = false;

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

const error = (state = initialErrorState, action) => {
  switch (action.type) {
    case SET_ERROR: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({ loading, error });

