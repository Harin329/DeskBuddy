import { tokenRequest } from "../authConfig";
import {msalInstance} from "../index";

const authenticateOptions = (options, token) => {
    let authOptions = Object.assign(options);
    if (typeof authOptions['headers'] !== Headers) {
        authOptions['headers'] = new Headers(authOptions['headers']);
    }
    authOptions['headers'].append('Authorization', `Bearer ${token}`);
    console.log(authOptions['headers'].get("body"));
    return authOptions;
}

export default function safeFetch(url, options) {
    const accounts = JSON.stringify(msalInstance.getAllAccounts()); // can probably replace this with getActiveAccount doing msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]) somewhere else first
    return msalInstance.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0]
    }).then((response) => {
        const authOptions = authenticateOptions(options, response.accessToken);
        return fetch(url, authOptions);
    }).catch(err => {
        throw Error("Something went wrong with authentication: " + err);
    });
}