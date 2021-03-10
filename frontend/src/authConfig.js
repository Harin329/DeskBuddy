/*
 * https://github.com/Azure-Samples/ms-identity-javascript-react-spa
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
    auth: {
        clientId: "42a72579-a163-4e8b-b427-aa7eb197eb87",
        authority: "https://login.microsoftonline.com/deskbuddy.onmicrosoft.com",
        redirectUri: "http://localhost:3001/"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

// Coordinates and required scopes for your web API
export const apiConfig = {
    resourceUri: "http://localhost:3000/",
    resourceScopes: ["api://d111cdab-6637-46bb-86b1-3685db9d744e/access_as_user"]
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["User.Read", "openid", "profile", "offline_access", ...apiConfig.resourceScopes]
};

// Add here scopes for access token to be used at the API endpoints.
export const tokenRequest = {
    scopes: [...apiConfig.resourceScopes]
}

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphMeEndpointBeta: "https://graph.microsoft.com/beta/me"
};

export const adminGroup = "e30cc8cd-3f89-4a78-80fc-678a1e04a791";