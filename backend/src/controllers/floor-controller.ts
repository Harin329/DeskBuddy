import { Floor } from '../models/floor';

export default class FloorController {
    // tslint:disable-next-line:no-empty
    constructor() { }

    findFloorByOffice(office_location: string, office_id: number) {
        return new Promise((resolve, reject) => {
            Floor.getFloorByOffice(office_location, office_id, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }
}