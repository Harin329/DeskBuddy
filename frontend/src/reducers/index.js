import { combineReducers } from "redux";
import reservations from "./reservations";
import authentication from "./authentication";
import global from "./global";
import mail from "./mail";

export default combineReducers({reservations, authentication, global, mail});