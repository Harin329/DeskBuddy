import DB from '../config/db-handler';

const con = DB.getCon();

export const Office = function (this: any, office: any) {
    this.office_id = office.office_id;
    this.office_location = office.office_location;
    this.name = office.name;
    this.address = office.address;
    this.office_photo = office.office_photo;
};

Office.getAllOffices = (result: any) => {
    con.query("SELECT * FROM office", (err: any, res: any) => {
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