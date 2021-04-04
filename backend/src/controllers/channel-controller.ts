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
            Channel.addChannel(req, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
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