import DB from '../config/db-handler';

const con = DB.getCon();

export const Desk = function (this: any, desk: any) {
    this.desk_id = desk.desk_id;
    this.fk_floor_num = desk.fk_floor_num;
    this.fk_office_id = desk.fk_office_id;
    this.fk_office_location = desk.fk_office_location;
    this.capacity = desk.capacity;
};

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