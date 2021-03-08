import { PublicClientApplication } from "@azure/msal-browser";
import { tokenRequest } from "../authConfig";

const msalInstance = "";

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
    msalInstance.acquireTokenSilent({
        ...tokenRequest,
        account: msalInstance.getActiveAccount()
    }).then((response) => {
        const authOptions = authenticateOptions(options, response.accessToken);
        return fetch(url, authOptions);
    }).catch(err => {
        throw Error("Something went wrong with authentication: " + err);
    });
}