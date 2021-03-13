import { combineReducers } from "redux";
import reservations from "./reservations";
import authentication from "./authentication";

export default combineReducers({reservations, authentication});