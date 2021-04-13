import {Request} from "../models/request";
import {requestIsAdmin} from "../util";
import { User } from '../models/user'

export default class RequestController {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    createRequest(req: any) {
        return new Promise((resolve, reject) => {
            User.getUserNameAndEmailByOID(req.authInfo.oid, (errGet: any, resGet: any) => {
                if (errGet) {
                    reject(errGet);
                }
                else {
                    const employeeInfo = JSON.parse(JSON.stringify(resGet))[0];
                    req.body.employee_id = req.authInfo.oid;
                    req.body.employee_name = employeeInfo.first_name + " " + employeeInfo.last_name;
                    req.body.employee_email = employeeInfo.email;
                    Request.createRequest(req.body, (err: any, res: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
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
            // req.body.employee_id = req.authInfo.oid;
            Request.closeRequest(req.body, (err: any, res: any) => {
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
            req.body.employee_id = req.authInfo.oid;
            Request.updateRequestEmployee(req.body, (err: any, res: any) => {
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
            if (!requestIsAdmin(req.authInfo)) {
                reject("unauthorized user");
            }
            req.body.admin_eid = req.authInfo.oid;
            Request.updateRequestAdmin(req.body, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }

}