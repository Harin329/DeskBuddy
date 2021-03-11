import { User } from '../models/user';

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
            email: req.body.mail
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
}