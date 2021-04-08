import { SET_NEW_MAIL, SET_NEW_MAIL_REQ, SET_NEW_MAIL_ALL, SET_NEW_MAIL_ADMIN, SET_NEW_MAIL_CLOSED } from "../actions/actionTypes";
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

const newMailRequests = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_MAIL_REQ: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const allMail = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_MAIL_ALL: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const allAdminMail = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_MAIL_ADMIN: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const allClosedMail = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_MAIL_CLOSED: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({ newMail, newMailRequests, allMail, allAdminMail, allClosedMail });

