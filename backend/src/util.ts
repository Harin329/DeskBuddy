import config from './config.json';

/*
 * params: authInfo object from an authenticated request
 * returns: true if request came from an admin user
 */
export const requestIsAdmin = (authInfo : any) => {
    return (authInfo.hasOwnProperty("groups") && authInfo.groups.includes(config.credentials.adminGroup));
}

/*
 * params: authInfo object from an authenticated request
 * returns: true if authenticated oid matches supplied oid
 */
export const oidMatchesRequest = (authInfo : any, oid : string) => {
    return (authInfo.oid === oid)
}






