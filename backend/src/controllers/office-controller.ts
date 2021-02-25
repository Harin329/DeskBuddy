import { Office } from '../models/office';

export default class OfficeController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    findAllOffices() {
        return new Promise((resolve, reject) => {
            Office.getAllOffices((err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    getAllFloors() {
        //
    }

    getOfficeByName(name: string) {

    }
}