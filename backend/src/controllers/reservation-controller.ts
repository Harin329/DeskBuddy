import { Reservation } from '../models/reservation';

export default class ReservationController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    createReservation(req: any) {
        const reservation = {
            fk_employee_id: req.body.employee_id,
            fk_desk_id: req.body.desk_id,
            fk_floor_num: req.body.floor_num,
            fk_office_id: req.body.office_id,
            fk_office_location: req.body.office_location,
            start_date: req.body.date,
            end_date: req.body.date,
        }

        return new Promise((resolve, reject) => {
            Reservation.createReservation(reservation, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })

    }

    findAllReservations() {
        return new Promise((resolve, reject) => {
            Reservation.getAllReservations((err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    findUpcomingReservations() {
        return new Promise((resolve, reject) => {
            Reservation.getUpcomingReservations((err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }
}