import { SET_RESERVATIONS, SET_EMPLOYEE_COUNT, SET_DESKS_RESULTS, CHECK_MORE, SET_PAGE, SET_OFFICES, SET_DESKS, SET_FLOORPLAN_AVAILABLE } from "./actionTypes";
import Endpoint, { resultOnPage } from '../config/Constants';
import { appendLeadingZeroes } from "../functions/Date";

export const makeReservation = (userID, deskObj, filter) => dispatch => {
    var day = new Date(filter.from)
    var toDay = new Date(filter.to)
    while (day <= toDay) {
        const newDay = day.setDate(day.getDate() + 1);
        day = new Date(newDay)

        const thisDate = day.getFullYear() + "-" + appendLeadingZeroes(day.getMonth() + 1) + "-" + appendLeadingZeroes(day.getDate());
        console.log(thisDate);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "employee_id": userID, "desk_id": String(deskObj.desk_id), "floor_num": Number(deskObj.fk_floor_num), "office_id": Number(deskObj.fk_office_id), "office_location": String(deskObj.fk_office_location), "date": thisDate });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(Endpoint + "/reservation", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .then(() => {
                dispatch(fetchReservations())
            })
            .catch(error => console.log('error', error));
    }
}

export const hasFloorplan = (params) => dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(Endpoint + "/floor/getFloorsByOffice/" + params[0] + "/" + params[1], requestOptions)
        .then((response) => response.text())
        .then(result => {
            const res = JSON.parse(result)
            // console.log(res);
            if (res.length > 0) {
                dispatch({ type: SET_FLOORPLAN_AVAILABLE, payload: false });
            } else {
                dispatch({ type: SET_FLOORPLAN_AVAILABLE, payload: true });
            }
        })
        .catch(error => console.log('error', error));
}

export const fetchOffices = () => dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(Endpoint + "/office/getAllOffices", requestOptions)
        .then((response) => response.text())
        .then(result => {
            dispatch({ type: SET_OFFICES, payload: JSON.parse(result) });
            // console.log(JSON.parse(result));
        })
        .catch(error => console.log('error', error));
}

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
                dispatch({ type: SET_DESKS_RESULTS, payload: res })
            } else {
                if (res[0] !== undefined) {
                    const finalRes = deskResults.concat(res)
                    dispatch({ type: SET_DESKS_RESULTS, payload: finalRes })
                }
            }
            const more = ((deskResults.length + res.length) % resultOnPage === 0 && res[0] !== undefined) || !append
            dispatch({ type: CHECK_MORE, payload: more })
            dispatch({ type: SET_PAGE, payload: pageStart + resultOnPage })
        })
        .catch(error => console.log('error', error));
}

export const fetchDesksByOffice = (params) => dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(Endpoint + "/desk/getDesksByOffice/" + params[0] + "/" + params[1], requestOptions)
        .then((response) => response.text())
        .then(result => {
            dispatch({ type: SET_DESKS, payload: JSON.parse(result) })
            // console.log(JSON.parse(result));
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
            // console.log(res)
            dispatch({ type: SET_RESERVATIONS, payload: res })
        })
        .catch(error => console.log('error', error));
}

export const cancelReservations = (rawBody, filter) => dispatch => {
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
            dispatch(fetchDesks(filter, false, 0, []));
        })
        .catch(error => console.log('error', error));
}

export const getEmployeeCount = (deskObj, filter) => dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(Endpoint + "/reservation/getCount/" + deskObj.office_id + "/" + filter.from + "/" + filter.to, requestOptions)
        .then(response => response.text())
        .then(result => {
            const res = JSON.parse(result)
            //console.log(res[0].avg)
            dispatch({ type: SET_EMPLOYEE_COUNT, payload: Math.ceil(res[0].avg) })

            if (res[0].avg == null) {
                dispatch({ type: SET_EMPLOYEE_COUNT, payload: 0 })
            }
        }).catch(error => console.log('error', error));
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
            dispatch({ type: SET_EMPLOYEE_COUNT, payload: Math.ceil(res[0].avg) })
            if (res[0].avg == null) {
                dispatch({ type: SET_EMPLOYEE_COUNT, payload: 0 })
            }
        }).catch(error => console.log('error', error));
};