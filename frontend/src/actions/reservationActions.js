import { GET_RESERVATIONS, GET_EMPLOYEE_COUNT } from "./actionTypes";
import Endpoint from '../config/Constants';

export const fetchReservations = () => dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(Endpoint + "/reservation/getUpcomingReservations", requestOptions)
        .then(response => response.text())
        .then(result => {
            const res = JSON.parse(result)
            console.log(res)
            dispatch({ type: GET_RESERVATIONS, payload: res })
        })
        .catch(error => console.log('error', error));
}

export const cancelReservations = (rawBody) => dispatch => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(rawBody);

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: rawBody,
        redirect: 'follow'
    };

    return fetch(Endpoint + "/reservation/deleteReservation", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .then(() => {
            dispatch(fetchReservations());
            // search(false, 0);
        })
        .catch(error => console.log('error', error));
}

export const getEmployeeCountUpcomingRes = (reservationObj) => dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(Endpoint + "/reservation/getCount/" + reservationObj.fk_office_id + "/" + reservationObj.start_date.split("T")[0] + "/" + reservationObj.end_date.split("T")[0], requestOptions)
        .then(response => response.text())
        .then(result => {
            const res = JSON.parse(result)
            console.log(res[0].avg)
            dispatch({ type: GET_EMPLOYEE_COUNT, payload: Math.ceil(res[0].avg) })
            if (res[0].avg == null) {
                dispatch({ type: GET_EMPLOYEE_COUNT, payload: "0" })
            }
        }).catch(error => console.log('error', error));
};