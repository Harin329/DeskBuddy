const sql = require('../config/db-handler');

export const Reservation = function (this: any, reservation: any) {
    this.reservation_id = reservation.reservation_id;
    this.employee_id = reservation.employee_id;
    this.desk_id = reservation.desk_id;
    this.start_date = reservation.start_date;
    this.end_date = reservation.end_date;
};

Reservation.getAllReservations = (result: any) => {
    sql.query("SELECT * FROM reservation", (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
        console.log(res);
    })
};