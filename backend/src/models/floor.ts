import DB from '../config/db-handler';
import { IFloor, IOffice } from '../interfaces/location.interface';

const con = DB.getCon();

export const Floor = function (this: any, floor: any) {
    this.floor_num = floor.floor_num;
    this.fk_office_id = floor.fk_office_id;
    this.fk_office_location = floor.fk_office_location;
    this.num_desks = floor.num_desks;
    this.floor_plan = floor.floor_plan;
};

Floor.addFloor = (id: number, floor: IFloor, office: IOffice, result: any) => {
    con.query('CALL createFloor(?, ?, ?, ?)',
    [
        floor.floor_num,
        id,
        office.city,
        floor.image
    ],
    (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
}

Floor.getFloorByOffice = (office_location: string, office_id: number, result: any) => {
    con.query('CALL getFloorByOffice(?,?)',
    [
        office_id,
        office_location,
    ],
    (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res[0]);
        }
    })
};

Floor.getAllFloorsByOffice = (office_location: string, office_id: number, result: any) => {
    con.query('CALL getFloorByOffice(?,?)',
    [
        office_id,
        office_location,
    ],
    (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};
