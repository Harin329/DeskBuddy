import { Desk } from '../models/desk';

export default class DeskController {
    // tslint:disable-next-line:no-empty
    constructor() { }

    findDeskByOffice(office_location: string, office_id: number) {
        return new Promise((resolve, reject) => {
            Desk.getDeskByOffice(office_location, office_id, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    getOpenDesks(req: any) {
        const reservationQuery = {
            desk_id: req.body.desk_id,
            fk_floor_num: req.body.floor_num,
            fk_office_id: req.body.office_id,
            fk_office_location: req.body.office_location,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        }

        if (req.body.office_location === '0') {
            // getAllOpenDesks
            return new Promise((resolve, reject) => {
                Desk.getAllOpenDesks(reservationQuery, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        } else if (req.body.desk_id === '0') {
            // getOpenDesksAtOffice
            return new Promise((resolve, reject) => {
                Desk.getOpenDesksAtOffice(reservationQuery, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                Desk.getOpenDesks(reservationQuery, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        }
    }
}