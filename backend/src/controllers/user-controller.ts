import { User } from '../models/user';
import {Announcement} from "../models/announcement";

export default class UserController {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    insertUser(req: any) {
        const user = {
            employee_id: req.body.oid,
            first_name: req.body.given_name,
            last_name: req.body.family_name,
            phone: req.body.mobilePhone,
            email: req.body.email
        }
        return new Promise((resolve, reject) => {
            User.insertUser(user, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }

    updatePhoto(oid: any, data: any) {
        return new Promise((resolve, reject) => {
            User.updatePhoto(oid, data, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }

    getUserNameByOffice(office_location: string, office_id: number) {
        return new Promise((resolve, reject) => {
            User.getUserNameByOffice(office_location, office_id,(err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }
}