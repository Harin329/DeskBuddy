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

export const diffDays = (start_date: string, end_date: string) => {
    const date1 = new Date(start_date);
    const date2 = new Date(end_date);
    const diff = date2.valueOf() - date1.valueOf();
    const diffInDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffInDays;
}

export const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }