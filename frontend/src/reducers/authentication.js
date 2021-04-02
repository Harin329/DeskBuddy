import {
    SET_MSAL_INSTANCE,
    GET_MSAL_INSTANCE,
    SET_LOGGED_IN,
    SET_USER_ADDED_TO_DB,
    SET_USER_DISPLAY_NAME,
    SET_PROFILE_PHOTO, SET_OID, SET_IS_ADMIN, SET_EMPLOYEES
} from "../actions/actionTypes";
import { combineReducers } from "redux";
import ICBC from "../assets/ICBC.png"

const initialFalseState = false;
const initialStringState = "";


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

const displayName = (state = initialStringState, action) => {
    switch (action.type) {
        case SET_USER_DISPLAY_NAME: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const oid = (state = initialStringState, action) => {
    switch (action.type) {
        case SET_OID: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const isAdmin = (state = initialFalseState, action) => {
    switch (action.type) {
        case SET_IS_ADMIN: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const profilePic = (state = null, action) => {
    switch (action.type) {
        case SET_PROFILE_PHOTO: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const users = (state = [], action) => {
    switch (action.type) {
        case SET_EMPLOYEES: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export default combineReducers({ addedToDB, displayName, profilePic, isAdmin, oid, users});
