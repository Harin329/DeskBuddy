import { PublicClientApplication } from "@azure/msal-browser";
import { tokenRequest } from "../authConfig";
import {msalInstance} from "../index";

const authenticateOptions = (options, token) => {
    let authOptions = JSON.parse(JSON.stringify(options)); // deep copies options
    let authHeader = new Headers();
    if (authOptions.hasOwnProperty('headers')) {
        authHeader = authOptions['headers'];
    }
    authHeader.append(`Authorization`, `Bearer ${token}`)
    authOptions['headers'] = authHeader;
    return authOptions;
}

export default function safeFetch(url, options) {
    const accounts = JSON.stringify(msalInstance.getAllAccounts()); // can probably replace this with getActiveAccount doing msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]) somewhere else first
    msalInstance.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0]
    }).then((response) => {
        const authOptions = authenticateOptions(options, response.accessToken);
        //return fetch(url, authOptions); // doesn't seem to work?
        fetch(url, authOptions).then(response => response.json()) // for testing. delete this.
            .then(responseJson =>
                alert(JSON.stringify(responseJson, null, 2))
            )
    }).catch(err => {
        throw Error("Something went wrong with authentication: " + err);
    });
}