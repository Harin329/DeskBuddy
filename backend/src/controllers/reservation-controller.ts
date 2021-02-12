import { Reservation } from '../models/reservation';

module.exports = class ReservationController {
    constructor() {}

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
}