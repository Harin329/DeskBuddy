import {SET_EMPLOYEES, SET_PROFILE_PHOTO} from "./actionTypes";
import safeFetch, {graphFetch} from "../util/Util";
import Endpoint from "../config/Constants";
import ICBC from "../assets/ICBC.png";
import { setError } from "./globalActions";

export const getProfilePhoto = () => dispatch => {
    const options = {
        method: "GET",
    };
    graphFetch("https://graph.microsoft.com/beta/me/photo/$value", options)
        .then(response => {
            if (response != null && response.ok) {
                response.blob().
                then(data => {
                    if (data !== null) {
                        window.URL = window.URL || window.webkitURL;
                        let pp =  window.URL.createObjectURL(data);
                        dispatch({ type: SET_PROFILE_PHOTO, payload: pp });
                        updateProfilePhoto(data);
                    }
                });
            } else {
                // set default profile photo
                fetch(ICBC)
                    .then(res => res.blob().
                    then(data => {
                        updateProfilePhoto(data);
                        dispatch({ type: SET_PROFILE_PHOTO, payload: ICBC });
                    }))
            }
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}

// Send profile photo to DeskBuddy database
const updateProfilePhoto = (data) => {
    let fd = new FormData();
    fd.append('image', data);

    const requestOptions = {
        method: 'POST',
        body: fd
    };

    safeFetch(Endpoint + "/user/photo", requestOptions)
        .then((response) => {
            if (!response.ok){
                throw Error("Error updating profile photo");}
        })
        .catch(error => {
            console.log('error', error);
        });
}

export const fetchEmployees = () => dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return safeFetch(Endpoint + "/user/", requestOptions)
    .then(response => {
        if (!response.ok) {
            dispatch(setError(true));
        }
        return response.text();
    })
        .then(result => {
            dispatch({ type: SET_EMPLOYEES, payload: JSON.parse(result) });
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}

export const fetchEmployeesFromAD = () => dispatch => {
    const options = {
        method: "GET",
    };

    return graphFetch("https://graph.microsoft.com/v1.0/users?$top=999", options)
        .then(response => {
            if (!response.ok) {
                dispatch(setError(true));
            }
            return response.text();
        })
        .then(res => JSON.parse(res))
            .then(resJSON => {
                dispatch({ type: SET_EMPLOYEES, payload: resJSON.value });
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}
