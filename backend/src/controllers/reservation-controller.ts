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

    findUpcomingReservations(req: any) {
        const userID = req.userID;
        return new Promise((resolve, reject) => {
            Reservation.getUpcomingReservations(userID, (err: any, res: any) => {
              if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    countEmployees(req: any) {
        const date = {
            office_id: req.officeID,
            start_date: req.startDate,
            end_date: req.endDate,
        }
        return new Promise((resolve, reject) => {
            Reservation.getEmployeeCountForOffice(date,(err: any, res: any) => {
              if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    deleteReservation(req: any, isAdmin: boolean) {
        const reservationID = req.body.reservation_id;
        const oid = req.authInfo.oid;
        if (isAdmin) {
            return new Promise((resolve, reject) => {
                Reservation.deleteReservation(reservationID, (err: any, res: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                Reservation.deleteReservationAssertUser(reservationID, oid, (err: any, res: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                })
            })
        }
    }

    getReservationByDate(req: any) {
        const date = req.date;
        const userID = req.userID;
        return new Promise((resolve, reject) => {
            Reservation.getReservationByDate(date, userID, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    getReservationByMonth(req: any) {
        const userID = req.userID;
        return new Promise((resolve, reject) => {
            Reservation.getReservationByMonth(userID, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }
}