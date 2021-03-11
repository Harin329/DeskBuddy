import { Channel } from '../models/channel';

export default class ChannelController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    getChannelForEmployee(employeeID: any) {
        return new Promise((resolve, reject) => {
            Channel.getAllChannelsForUser(employeeID, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    deleteChannel(req: any) {
        return new Promise((resolve, reject) => {
            Channel.deleteChannel(req, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }
}