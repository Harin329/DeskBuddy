import {SET_MSAL_INSTANCE, GET_MSAL_INSTANCE} from "../actions/actionTypes";
import { combineReducers } from "redux";

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