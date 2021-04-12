import {
  SET_RESERVATIONS,
  SET_EMPLOYEE_COUNT,
  SET_DESKS_RESULTS,
  CHECK_MORE,
  SET_PAGE,
  SET_FILTER,
  SET_OFFICES,
  SET_FLOORPLAN_AVAILABLE,
  SET_DESKS,
  SET_FLOORS_IN_UPDATE,
  CONFIRM_DELETE_POPUP,
  CONFIRM_UPDATE_POPUP,
  SET_CONFIRM_DELETE_POPUP,
  SET_CONFIRM_UPDATE_POPUP,
  SET_EDITS_IN_UPDATE,
  SET_FLOOR_IN_UPDATE, SET_DESKS_IN_UPDATE
} from "../actions/actionTypes";
import { combineReducers } from "redux";
import { appendLeadingZeroes } from "../functions/Date";
import {initialLocationEditsObj} from "../components/reservation/UpdateLocationPopup";

const date = new Date();
const formattedDate = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());

const initialState = [];
const initialStringState = "";
const initialBoolState = true;
const initialFalseState = false;
const initialNumState = 0;
const initialFilter = {
  desk: 'All',
  office: 'All',
  from: formattedDate,
  to: formattedDate,
}

const desks = (state = initialState, action) => {
  switch (action.type) {
    case SET_DESKS: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const hasFloorplan = (state = initialBoolState, action) => {
  switch (action.type) {
    case SET_FLOORPLAN_AVAILABLE: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const offices = (state = initialState, action) => {
  switch (action.type) {
    case SET_OFFICES: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const searchFilter = (state = initialFilter, action) => {
  switch (action.type) {
    case SET_FILTER: {
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
    case SET_PAGE: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const deskResults = (state = initialState, action) => {
  switch (action.type) {
    case SET_DESKS_RESULTS: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const upcomingReservations = (state = initialState, action) => {
  switch (action.type) {
    case SET_RESERVATIONS: {
        return action.payload;
    }
    default: {
      return state;
    }
  }
};

const deskEmployeeCount = (state = initialNumState, action) => {
    switch (action.type) {
      case SET_EMPLOYEE_COUNT: {
          return action.payload;
      }
      default: {
        return state;
      }
    }
  };

const floorsPerOfficeInUpdate = (state = initialState, action) => {
  switch (action.type) {
    case SET_FLOORS_IN_UPDATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

const confirmDeletePopup = (state = initialFalseState, action) => {
  switch (action.type) {
    case SET_CONFIRM_DELETE_POPUP: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

const confirmUpdatePopup = (state = initialFalseState, action) => {
  switch (action.type) {
    case SET_CONFIRM_UPDATE_POPUP: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

const currLocationEditsRedux = (state = JSON.parse(JSON.stringify(initialLocationEditsObj)), action) => {
  switch (action.type) {
    case SET_EDITS_IN_UPDATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

const updateLocationFloorRedux = (state = null, action) => {
  switch (action.type) {
    case SET_FLOOR_IN_UPDATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

const updateLocationDeskIDsRedux = (state = null, action) => {
  switch (action.type) {
    case SET_DESKS_IN_UPDATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({ upcomingReservations, deskEmployeeCount, deskResults, hasMore, pageCount, searchFilter, offices, hasFloorplan, desks, floorsPerOfficeInUpdate, confirmDeletePopup, confirmUpdatePopup, currLocationEditsRedux, updateLocationFloorRedux, updateLocationDeskIDsRedux });

