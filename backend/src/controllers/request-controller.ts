import {Request} from "../models/request";

export default class RequestController {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    createRequest(req: any) {
        return new Promise((resolve, reject) => {
            Request.createRequest(req, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }

    getAllRequests(employeeID: any) {
        return new Promise((resolve, reject) => {
            Request.getAllRequests(employeeID, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }

    closeRequest(req: any) {
        return new Promise((resolve, reject) => {
            Request.closeRequest(req, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }

    updateRequestEmployee(req: any) {
        return new Promise((resolve, reject) => {
            Request.updateRequestEmployee(req, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }

    updateRequestAdmin(req: any) {
        return new Promise((resolve, reject) => {
            Request.updateRequestAdmin(req, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }

}