import { Channel } from '../models/channel';

export default class ChannelController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    getChannelForEmployee(isAdmin: boolean) {
        return new Promise((resolve, reject) => {
            Channel.getAllChannelsForUser(isAdmin, (err: any, res: any) => {
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

    postAddChannel(req: any) {
        return new Promise((resolve, reject) => {
            Channel.postAddChannel(req, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }
}