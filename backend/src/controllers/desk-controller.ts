import { Desk } from '../models/desk';

export default class DeskController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    findDeskByOffice(office_location: string, office_id: number) {
        return new Promise((resolve, reject) => {
            Desk.getDeskByOffice(office_location, office_id, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }
}