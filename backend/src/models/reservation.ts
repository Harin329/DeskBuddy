import DB from '../config/db-handler';
export interface Reserve {
    id: string
}
const con = DB.getCon();

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
                result(null, res[0][0]['LAST_INSERT_ID()']);
            }
        }
    )
};

Reservation.getAllReservations = (result: any) => {
    con.query("SELECT * FROM reservation", (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

// Get upcoming reservations from the current date
Reservation.getUpcomingReservations = (userID: any, result: any) => {
    con.query("CALL getUpcomingReservation(?)", [userID], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            result(null, res[0]);
        }
    })
};

Reservation.getEmployeeCountForOffice = (params: any, result: any) => {
    // console.log(params.start_date);
    con.query("SELECT AVG(z.count) AS avg FROM (SELECT COUNT(*) AS count FROM reservation WHERE start_date >= ? AND end_date <= ? AND fk_office_id = ? GROUP BY start_date) AS z", [
        params.start_date,
        params.end_date,
        params.office_id,
    ], (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

Reservation.getReservationByDate = (date: any, userID: any, result: any) => {
    con.query("SELECT * FROM reservation r " +
        "WHERE r.start_date = ? AND r.fk_employee_id = ?", [
        String(date),
        String(userID)
    ], (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

Reservation.getReservationByMonth = (userID: any, result: any) => {
    con.query("CALL getReservationsThisMonth(?)", [userID], (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

Reservation.deleteReservation = (reservationID: any, result: any) => {
    con.query("CALL deleteReservation(?)", [reservationID], (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

Reservation.deleteReservationAssertUser = (reservationID: any, oid: any, result: any) => {
    con.query("CALL deleteReservationAssertUser(?,?)", [reservationID, oid], (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else if (res.affectedRows === 0){
            result(new Error("No matching reservations"), null);
        }else {
            result(null, res);
        }
    })
};