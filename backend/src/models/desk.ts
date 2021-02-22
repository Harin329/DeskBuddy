import DB from '../config/db-handler';
import { IDesk, IFloor, IOffice } from '../interfaces/location.interface';

const con = DB.getCon();

export const Desk = function (this: any, desk: any) {
    this.desk_id = desk.desk_id;
    this.fk_floor_num = desk.fk_floor_num;
    this.fk_office_id = desk.fk_office_id;
    this.fk_office_location = desk.fk_office_location;
    this.capacity = desk.capacity;
};

Desk.addDesk = (id: number, desk: IDesk, floor: IFloor, office: IOffice, result: any) => {
    con.query('CALL createDesk(?, ?, ?, ?, ?)',
    [
        desk.ID,
        floor.floor_num,
        id,
        office.city,
        desk.capacity
    ],
    (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
}

// tslint:disable-next-line:variable-name
Desk.getDeskByOffice = (office_location: string, office_id: number, result: any) => {
    con.query('CALL getDeskByOffice(?,?)',
    [
        office_id,
        office_location,
    ],
    (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res[0]);
        }
        console.log(res);
    })
};

Desk.getOpenDesks = (reservationQuery: any, result: any) => {
    con.query('CALL getOpenDesks(?,?,?,?,?,?)',
    [
        reservationQuery.fk_office_id,
        reservationQuery.fk_office_location,
        reservationQuery.desk_id,
        reservationQuery.fk_floor_num,
        reservationQuery.start_date,
        reservationQuery.end_date,
    ],
    (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res[0]);
        }
        console.log(res);
    })
};

Desk.getOpenDesksAtOffice = (reservationQuery: any, result: any) => {
    con.query('CALL getOpenDesksAtOffice(?,?,?,?)',
    [
        reservationQuery.fk_office_id,
        reservationQuery.fk_office_location,
        reservationQuery.start_date,
        reservationQuery.end_date,
    ],
    (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res[0]);
        }
        console.log(res);
    })
};

Desk.getAllOpenDesks = (reservationQuery: any, result: any) => {
    con.query('CALL getAllOpenDesks(?,?)',
    [
        reservationQuery.start_date,
        reservationQuery.end_date,
    ],
    (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res[0]);
        }
        console.log(res);
    })
};