import {SET_MSAL_INSTANCE, GET_MSAL_INSTANCE, SET_LOGGED_IN, SET_USER_ADDED_TO_DB } from "../actions/actionTypes";
import { combineReducers } from "redux";

const initialFalseState = false;

const authenticator = (state = {}, action) => {
    switch(action.type) {
        case SET_MSAL_INSTANCE:
            return action.payload;
        case GET_MSAL_INSTANCE:
            return 0;
        default:
            return state;
    }
}

const addedToDB = (state = initialFalseState, action) => {
    switch (action.type) {
        case SET_USER_ADDED_TO_DB: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export default combineReducers({ addedToDB });
