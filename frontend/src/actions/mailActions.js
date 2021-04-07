import { SET_NEW_MAIL } from "./actionTypes";
import Endpoint, { resultOnPage } from '../config/Constants';
import safeFetch from "../util/Util";
import { setError, setLoading } from "./globalActions";

export const getNewMail = (userID) => dispatch => {

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    safeFetch(Endpoint + "/mail/" + userID + "?filter=new", requestOptions)
        .then(response => {
            if (!response.ok) {
                dispatch(setError(true));
            }
            return response.text();
        })
        .then(result => {
            const mail = JSON.parse(result).mails;
            const sortedMail = mail.sort((a, b) => { return new Date(b.approx_date) - new Date(a.approx_date) });
            console.log("here")
            dispatch({ type: SET_NEW_MAIL, payload: [...sortedMail] });
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}
