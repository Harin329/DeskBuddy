import { Reservation } from '../models/reservation';
import * as utils from './txn-util';
import db from '../config/db-handler';
import * as util from '../util';
const conn = db.getCon();

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
            });
        });
    }

    createReservationRange(req: any) {
        const reservations = [];
        const difference = util.diffDays(req.body.start_date, req.body.end_date) + 1;
        const start = new Date(req.body.start_date);
        for (let i = 0; i < difference; i++) {
            const currDate = new Date(start.getTime() + i * (1000 * 60 * 60 * 24));
            const currStringDate = util.formatDate(currDate);
            const reservation = {
                fk_employee_id: req.body.employee_id,
                fk_desk_id: req.body.desk_id,
                fk_floor_num: req.body.floor_num,
                fk_office_id: req.body.office_id,
                fk_office_location: req.body.office_location,
                start_date: currStringDate,
                end_date: currStringDate,
            }
            reservations.push(reservation);
        }
        utils.begin(conn);
        const promises = [];
        for (const reservation of reservations) {
            const promise = new Promise((resolve, reject) => {
                Reservation.createReservation(reservation, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            });
            promises.push(promise);
        }
        return Promise.all(promises).then(result => {
            utils.end(conn);
            return Promise.resolve(result);
        }).catch(err => {
            utils.rollback(conn);
            return Promise.reject(err);
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