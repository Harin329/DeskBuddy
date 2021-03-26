import DB from '../config/db-handler';
import { IOffice } from '../interfaces/location.interface';

const con = DB.getCon();

export const Office = function (this: any, office: any) {
    this.office_id = office.office_id;
    this.office_location = office.office_location;
    this.name = office.name;
    this.address = office.address;
    this.office_photo = office.office_photo;
};

Office.addOffice = (id: number, office: IOffice, result: any) => {
    con.query('CALL createOffice(?, ?, ?, ?, ?)',
    [
        id,
        office.city,
        office.name,
        office.address,
        Buffer.from(office.image, 'base64')
    ],
    (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
}

Office.deleteOffice = (city: string, id: number, result: any) => {
    con.query('CALL deleteOffice(?, ?)',
    [
        id,
        city
    ],
    (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res.affectedRows);
        }
    });
}

Office.getAllOfficeIDs = (city: string, result: any) => {
    con.query(`SELECT office_id FROM office WHERE office_location = "${city}"`, (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

Office.getAllOffices = (result: any) => {
    con.query("SELECT * FROM office", (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

Office.updateOffice = (id: number, office: IOffice, originalId: number, originalCity: string, result: any) => {
    con.query('CALL updateOffice(?, ?, ?, ?, ?, ?, ?)',
    [
        id,
        office.city,
        office.name,
        office.address,
        originalId,
        originalCity,
        Buffer.from(office.image, 'base64')
    ],
    (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
}