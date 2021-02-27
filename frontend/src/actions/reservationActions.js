import { GET_RESERVATIONS, GET_EMPLOYEE_COUNT, GET_DESKS, CHECK_MORE, GET_PAGE } from "./actionTypes";
import Endpoint, { resultOnPage } from '../config/Constants';


export const fetchDesks = (filter, append, pageStart, deskResults) => dispatch => {
    var deskParam = ['0', '0']
    var officeParam = ['0', '0']

    if (filter.desk.includes('-')) {
        deskParam = filter.desk.split(['-']);
    }
    if (filter.office.includes('-')) {
        officeParam = filter.office.split(['-']);
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "desk_id": String(deskParam[1]),
        "floor_num": Number(deskParam[0]),
        "office_id": Number(officeParam[1]),
        "office_location": String(officeParam[0]),
        "start_date": filter.from,
        "end_date": filter.to,
        "startIndex": pageStart,
        "numOnPage": resultOnPage
    });

    console.log(raw);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(Endpoint + "/desk/getOpenDesks", requestOptions)
        .then(response => response.text())
        .then(result => {
            const res = JSON.parse(result)
            console.log(res)
            if (deskResults.length === 0 || !append) {
                dispatch({ type: GET_DESKS, payload: res })
            } else {
                if (res[0] !== undefined) {
                    const finalRes = deskResults.concat(res)
                    dispatch({ type: GET_DESKS, payload: finalRes })
                }
            }
            const more = ((deskResults.length + res.length) % resultOnPage === 0 && res[0] !== undefined) || !append
            dispatch({ type: CHECK_MORE, payload: more })
            dispatch({ type: GET_PAGE, payload: pageStart + resultOnPage })
        })
        .catch(error => console.log('error', error));
}

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