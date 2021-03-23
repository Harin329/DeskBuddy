import { Request, Response, NextFunction, response } from 'express';
import { IOffice, IFloor, IDesk } from '../interfaces/location.interface';
import { Desk } from '../models/desk';
import { Floor } from '../models/floor';
import { Office } from '../models/office';
import fs from 'fs';
import db from '../config/db-handler';
import mysql from 'mysql';

const conn = db.getCon();

export default class LocationController {
    // tslint:disable-next-line:no-empty
    constructor() { }

    /*
        Adds an office into the database.
        @param: req is the request, which contains the office in req.body
        @return: promise of type boolean to signify if adding location was successful or not.
    */
    public async addLocation(req: any): Promise<string> {
        await this.begin(conn);
        try {
            // parse body and image
            if (!req.body.body) {
                throw new Error("Body is missing");
            }
            const office: IOffice = JSON.parse(req.body.body);
            this.populateImages(office, req);
            const unparsedIDs = await this.getOfficeIDs(office.city);
            const IDs: any[] = JSON.parse(JSON.stringify(unparsedIDs));
            const availableID = this.computeID(IDs);
            const officeRes = await this.addOffice(availableID, office);
            if (officeRes !== true) {
                await this.rollback(conn);
                return Promise.reject(false);
            }
            const floorRes = await this.addFloors(availableID, office);
            if (floorRes !== true) {
                await this.rollback(conn);
                return Promise.reject(false);
            }
            const deskRes = await this.addDesks(availableID, office);
            if (deskRes !== true) {
                await this.rollback(conn);
                return Promise.reject(false);
            }
            await this.end(conn);
            return Promise.resolve(office.city + "-" + availableID);
        } catch (err) {
            await this.rollback(conn);
            return Promise.reject(err);
        }
    }

    private async getOfficeIDs(city: string) {
        return new Promise((resolve, reject) => {
            Office.getAllOfficeIDs(city, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    private async addOffice(id: number, office: IOffice) {
        return new Promise((resolve, reject) => {
            Office.addOffice(id, office, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
    }

    private async addFloors(id: number, office: IOffice) {
        const promises = [];
        for (const floor of office.floors) {
            const floorPromise = this.addFloor(id, floor, office);
            promises.push(floorPromise);
        }
        return Promise.all(promises).then((res) => {
            return Promise.resolve(true);
        }).catch((err) => {
            return Promise.reject(false);
        });
    }

    private async addFloor(id: number, floor: IFloor, office: IOffice) {
        return new Promise((resolve, reject) => {
            Floor.addFloor(id, floor, office, (err: any, res: any) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    private async addDesks(id: number, office: IOffice) {
        const promises = [];
        for (const floor of office.floors) {
            for (const desk of floor.desks) {
                const deskPromise = this.addDesk(id, desk, floor, office);
                promises.push(deskPromise);
            }
        }
        return Promise.all(promises).then((res) => {
            return Promise.resolve(true);
        }).catch((err) => {
            return Promise.reject(false);
        });
    }

    private async addDesk(id: number, desk: IDesk, floor: IFloor, office: IOffice) {
        return new Promise((resolve, reject) => {
            Desk.addDesk(id, desk, floor, office , (err: any, res: any) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /*
    *   From a list of unique building numbers, get the lowest available integer,
    *   ranging from 1 to 100
    *   Else, return 0.
    */
    private computeID(IDs: any[]) {
        const numericIDs = [];
        for (const item of IDs) {
            numericIDs.push(item.office_id);
        }
        for (let i = 1; i < 100; i++) {
            if (!numericIDs.includes(i)) {
                return i;
            }
        }
        return 0;
    }

    public async deleteLocation(city: string, id: number): Promise<number> {
        const result = await this.deleteOffice(city, id);
        if (!result) {
            return Promise.reject(false);
        } else {
            return Promise.resolve(result);
        }
    }

    private deleteOffice(city: string, id: number): Promise<number> {
        return new Promise((resolve, reject) => {
            Office.deleteOffice(city, id, (err: any, res: any) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(res);
                }
            })
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

    private populateImages(office: IOffice, req: any) {
        for (const file of req.files) {
            if (file.fieldname === "image") {
                office.image = Buffer.from(file.buffer).toString('base64');
            } else if (file.fieldname.startsWith("floor_") &&
                        file.fieldname.endsWith("_image")) {
                const floor_num = file.fieldname.charAt(6);
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < office.floors.length; i++) {
                    if (office.floors[i].floor_num === floor_num) {
                        office.floors[i].image = Buffer.from(file.buffer).toString('base64');
                    }
                }
            }
        }
        if (!office.image) {
            office.image = fs.readFileSync("src/images/defaultBuildingImage.jpg").toString('base64')
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < office.floors.length; i++) {
            if (!office.floors[i].image) {
                office.floors[i].image = fs.readFileSync("src/images/defaultFloorPlanImage.jpg").toString('base64')
            }
        }
    }
}