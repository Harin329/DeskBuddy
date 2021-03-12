import {adminGroup, apiConfig, graphScopes, tokenRequest} from "../authConfig";
import {msalInstance} from "../index";

const authenticateOptions = (options, token) => {
    let authOptions = Object.assign(options);
    if (typeof authOptions['headers'] !== Headers) {
        authOptions['headers'] = new Headers(authOptions['headers']);
    }
    authOptions['headers'].append('Authorization', `Bearer ${token}`);
    return authOptions;
}

/*
 * Wrapper function to add access token for calls to DeskBuddy API.
 */
export default function safeFetch(url, options) {
    const accounts = msalInstance.getAllAccounts(); // can probably replace this with getActiveAccount doing msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]) somewhere else first
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

/*
 * Wrapper function to add access token for calls to Microsoft Graph.
 * Some potential queries: https://developer.microsoft.com/en-us/graph/graph-explorer
 */
export function graphFetch(url, options) {
    const accounts = msalInstance.getAllAccounts();
    return msalInstance.acquireTokenSilent({
        scopes: graphScopes,
        account: accounts[0]
    }).then((response) => {
        const authOptions = authenticateOptions(options, response.accessToken);
        return fetch(url, authOptions);
    }).catch(err => {
        throw Error("Something went wrong with authentication: " + err);
    });
}

export function accountIsAdmin(accountIdentifiers){
    return (accountIdentifiers.idTokenClaims.hasOwnProperty("groups")
            && accountIdentifiers.idTokenClaims.groups.includes(adminGroup));
}