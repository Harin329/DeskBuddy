import { SET_NEW_MAIL, SET_NEW_MAIL_ADMIN, SET_NEW_MAIL_ALL, SET_NEW_MAIL_CLOSED, SET_NEW_MAIL_REQ } from "./actionTypes";
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
            dispatch({ type: SET_NEW_MAIL, payload: [...sortedMail] });
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}

export const getNewMailReq = (office, employee) => dispatch => {
    const [officeLocation, officeId] = office ? office.split(/-(?=[^-]+$)/) : [];

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const fullEndpoint = officeLocation && officeId ? `${Endpoint}/mail?filter=awaiting_admin_action&locname=${officeLocation}&locid=${officeId}` : `${Endpoint}/mail?filter=awaiting_admin_action`;

    safeFetch(fullEndpoint, requestOptions)
        .then(response => {
            if (!response.ok) {
                dispatch(setError(true));
            }
            return response.text();
        })
        .then(result => {
            let mail = JSON.parse(result).mails;
            if (employee !== "" && employee !== undefined) {
                mail = mail.filter((mailObj) => mailObj.recipient_email === employee);
            }
            mail.map((mailObj) => mailObj.status = 'Needs Attention from Admin');
            const sortedMail = mail.sort((a, b) => { return new Date(b.approx_date) - new Date(a.approx_date) });
            dispatch({ type: SET_NEW_MAIL_REQ, payload: [...sortedMail] });
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}


export const getNewMailAll = (userOID, filter) => dispatch => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    switch (filter) {
        case 'Admin has Responded':
            safeFetch(Endpoint + "/mail/" + userOID + "?filter=awaiting_employee_confirmation&sort=-modified_at", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        dispatch(setError(true));
                    }
                    return response.text();
                })
                .then(result => {
                    const mail = JSON.parse(result).mails;
                    mail.map((mailObj) => {
                        mailObj.status = 'Admin has Responded';
                    });
                    dispatch({ type: SET_NEW_MAIL_ALL, payload: [...mail] });
                })
                .catch(error => {
                    console.log('error', error);
                    dispatch(setError(true));
                });
            break;
        case 'Waiting for Admin':
            safeFetch(Endpoint + "/mail/" + userOID + "?filter=awaiting_admin_action&sort=-modified_at", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        dispatch(setError(true));
                    }
                    return response.text();
                })
                .then(result => {
                    const mail = JSON.parse(result).mails;
                    mail.map((mailObj) => mailObj.status = 'Waiting for Admin');
                    dispatch({ type: SET_NEW_MAIL_ALL, payload: [...mail] });
                })
                .catch(error => {
                    console.log('error', error);
                    dispatch(setError(true));
                });
            break;
        case 'Cannot Complete':
            safeFetch(Endpoint + "/mail/" + userOID + "?filter=cannot_complete&sort=-modified_at", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        dispatch(setError(true));
                    }
                    return response.text();
                })
                .then(result => {
                    const mail = JSON.parse(result).mails;
                    mail.map((mailObj) => mailObj.status = 'Cannot Complete');
                    dispatch({ type: SET_NEW_MAIL_ALL, payload: [...mail] });
                })
                .catch(error => {
                    console.log('error', error);
                    dispatch(setError(true));
                });
            break;
        case 'Closed':
            safeFetch(Endpoint + "/mail/" + userOID + "?filter=closed&sort=-modified_at", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        dispatch(setError(true));
                    }
                    return response.text();
                })
                .then(result => {
                    const mail = JSON.parse(result).mails;
                    mail.map((mailObj) => mailObj.status = 'Closed');
                    dispatch({ type: SET_NEW_MAIL_ALL, payload: [...mail] });
                })
                .catch(error => {
                    console.log('error', error);
                    dispatch(setError(true));
                });
            break;
        default:
            break;
    }
}


export const getNewMailAdmin = (office, employee) => dispatch => {
    const [officeLocation, officeId] = office ? office.split(/-(?=[^-]+$)/) : [];

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const fullEndpoint = officeLocation && officeId ? `${Endpoint}/mail?filter=awaiting_employee_confirmation&locname=${officeLocation}&locid=${officeId}` : `${Endpoint}/mail?filter=awaiting_employee_confirmation`;

    safeFetch(fullEndpoint, requestOptions)
        .then(response => {
            if (!response.ok) {
                dispatch(setError(true));
            }
            return response.text();
        })
        .then(result => {
            let mail = JSON.parse(result).mails;
            if (employee !== "" && employee !== undefined) {
                mail = mail.filter((mailObj) => mailObj.recipient_email === employee);
            }
            mail.map((mailObj) => mailObj.status = 'Admin Has Responded');
            dispatch({ type: SET_NEW_MAIL_ADMIN, payload: [...mail] });
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}


export const getNewMailClosed = (office, employee) => dispatch => {
    const [officeLocation, officeId] = office ? office.split(/-(?=[^-]+$)/) : [];
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const fullEndpoint = officeLocation && officeId ? `${Endpoint}/mail?filter=closed&locname=${officeLocation}&locid=${officeId}` : `${Endpoint}/mail?filter=closed`;
    safeFetch(fullEndpoint, requestOptions)
        .then(response => {
            if (!response.ok) {
                dispatch(setError(true));
            }
            return response.text();
        })
        .then(result => {
            let mail = JSON.parse(result).mails;
            if (employee !== "" && employee !== undefined) {
                mail = mail.filter((mailObj) => mailObj.recipient_email === employee);
            }
            mail.map((mailObj) => mailObj.status = 'Closed');
            dispatch({ type: SET_NEW_MAIL_CLOSED, payload: [...mail] });
        })
        .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
        });
}