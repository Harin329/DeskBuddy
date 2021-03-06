/*
 * https://github.com/Azure-Samples/ms-identity-javascript-react-spa
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";
import Endpoint, {EndpointFE} from "./config/Constants";

export const tenantId = "65f40c4a-aa31-4c7c-8e53-5c0ca832c7ed";
export const clientId = "42a72579-a163-4e8b-b427-aa7eb197eb87";
export const scopeURI = "api://d111cdab-6637-46bb-86b1-3685db9d744e/access_as_user";
export const adminGroup = "e30cc8cd-3f89-4a78-80fc-678a1e04a791";

export const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: EndpointFE
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
    resourceUri: Endpoint,
    resourceScopes: [scopeURI]
}

export const graphScopes = ["User.Read", "openid", "profile", "User.ReadBasic.All"];

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: [...graphScopes]
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