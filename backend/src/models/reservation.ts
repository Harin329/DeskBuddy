import { con } from '../config/db-handler';
console.log("hai");
export interface Reserve {
    id: string
}

export const Reservation = function (this: any, reservation: any) {
    this.reservation_id = reservation.reservation_id;
    this.fk_employee_id = reservation.fk_employee_id;
    this.fk_floor_num = reservation.fk_floor_num;
    this.fk_office_id = reservation.fk_office_id;
    this.fk_office_location = reservation.fk_office_location;
    this.fk_desk_id = reservation.fk_desk_id;
    this.start_date = reservation.start_date;
    this.end_date = reservation.end_date;
};

Reservation.createReservation = (newReservation: any, result: any) => {
    con.query(
        'CALL createReservation(?,?,?,?,?,?,?)',
        [
            newReservation.fk_employee_id,
            newReservation.fk_desk_id,
            newReservation.fk_floor_num,
            newReservation.fk_office_id,
            newReservation.fk_office_location,
            newReservation.start_date,
            newReservation.end_date,
        ],
        (err: any, res: any) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
            } else {
                console.log("Reservation Created: ", { ...newReservation });
                result(null, newReservation);
            }
        }
    )
};

Reservation.getAllReservations = (result: any) => {
    con.query("SELECT * FROM reservation", (err: any, res: any) => {
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