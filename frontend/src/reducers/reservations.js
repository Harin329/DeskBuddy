import { GET_RESERVATIONS, GET_EMPLOYEE_COUNT } from "../actions/actionTypes";
import { combineReducers } from "redux";

const initialState = [];
const initialStringState = "";

const upcomingReservations = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESERVATIONS: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const deskEmployeeCount = (state = initialStringState, action) => {
    switch (action.type) {
      case GET_EMPLOYEE_COUNT: {
          return action.payload;
      }
      default: {
        return state;
      }
    }
  };

export default combineReducers({ upcomingReservations, deskEmployeeCount });