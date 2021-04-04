import { IChannel } from '../interfaces/channel.interface';
import { Channel } from '../models/channel';
import e, { Request, Response, NextFunction, response } from 'express';
import { IOffice, IFloor, IDesk } from '../interfaces/location.interface';
import { Desk } from '../models/desk';
import { Floor } from '../models/floor';
import { Office } from '../models/office';
import fs from 'fs';
import db from '../config/db-handler';
import mysql from 'mysql'

const conn = db.getCon();

export default class ChannelController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    public async addChannel(req: any): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                if (!req.body.body) {
                    throw new Error("body is missing");
                }
                const body = JSON.parse(req.body.body);
                let image;
                if (req.files.length > 0) {
                    image = Buffer.from(req.files[0].buffer).toString('base64');
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

    private async begin(con: mysql.Connection) {
        const result = await this.beginTxn(con);
        return result;
    }

    private beginTxn(con: mysql.Connection) {
        return new Promise((resolve, reject) => {
            con.beginTransaction(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

    private async end(con: mysql.Connection) {
        const result = await this.endTxn(con);
        return result;
    }

    private endTxn(con: mysql.Connection) {
        return new Promise((resolve, reject) => {
            con.commit(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

    private async rollback(con: mysql.Connection) {
        const result = await this.rollbackTxn(con);
        return result;
    }

    private rollbackTxn(con: mysql.Connection) {
        return new Promise((resolve, reject) => {
            con.rollback(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
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