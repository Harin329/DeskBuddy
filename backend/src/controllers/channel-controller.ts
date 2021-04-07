import { IChannel } from '../interfaces/channel.interface';
import { Channel } from '../models/channel';
import fs from 'fs';
import db from '../config/db-handler';
import Jimp from "jimp";

export default class ChannelController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    public async addChannel(req: any): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.body.body) {
                    throw new Error("body is missing");
                }
                const body = JSON.parse(req.body.body);
                let image;
                if (req.files.length > 0) {
                    image = await Jimp.read(Buffer.from(req.files[0].buffer, 'base64'));
                    image.resize(75, 75);
                    const compressedImageBuffer = await image.getBufferAsync(image.getMIME());
                    image = compressedImageBuffer.toString('base64');
                } else {
                    image = fs.readFileSync("src/images/defaultChannelImage.jpg").toString('base64');
                }
                const channel: IChannel = {
                    title: body.channel_name,
                    image,
                }
                Channel.addChannel(channel, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            } catch (err: any) {
                console.log(err);
                reject(err);
            }
        })
    }

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
}