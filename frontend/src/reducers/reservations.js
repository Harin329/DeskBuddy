import { GET_RESERVATIONS, GET_EMPLOYEE_COUNT, GET_DESKS, CHECK_MORE, GET_PAGE, GET_FILTER } from "../actions/actionTypes";
import { combineReducers } from "redux";
import { appendLeadingZeroes } from "../functions/Date";

const date = new Date();
const formattedDate = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());

const initialState = [];
const initialStringState = "";
const initialBoolState = true;
const initialNumState = 0;
const initialFilter = {
  desk: 'All',
  office: 'All',
  from: formattedDate,
  to: formattedDate,
}

const searchFilter = (state = initialFilter, action) => {
  switch (action.type) {
    case GET_FILTER: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const hasMore = (state = initialBoolState, action) => {
  switch (action.type) {
    case CHECK_MORE: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const pageCount = (state = initialNumState, action) => {
  switch (action.type) {
    case GET_PAGE: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const deskResults = (state = initialState, action) => {
  switch (action.type) {
    case GET_DESKS: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

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

export default combineReducers({ upcomingReservations, deskEmployeeCount, deskResults, hasMore, pageCount, searchFilter });