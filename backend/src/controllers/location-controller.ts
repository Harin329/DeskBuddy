import e, { Request, Response, NextFunction, response } from 'express';
import { IOffice, IFloor, IDesk } from '../interfaces/location.interface';
import { Desk } from '../models/desk';
import { Floor } from '../models/floor';
import { Office } from '../models/office';
import fs from 'fs';
import db from '../config/db-handler';
import mysql from 'mysql';
import Jimp from 'jimp';

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
        const image = await Jimp.read(Buffer.from(office.image, 'base64'));
        image.resize(75, 75);
        const compressedImageBuffer = await image.getBufferAsync(image.getMIME());
        office.image = compressedImageBuffer.toString('base64');

        return new Promise((resolve, reject) => {
            Office.addOffice(id, office, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }

    /*
        private async addOffice(id: number, office: IOffice) {
            return new Promise((resolve, reject) => {
                Jimp.read(Buffer.from(office.image, 'base64'))
                    .then(image => {
                        image.resize(75,75);
                        image.getBufferAsync(image.getMIME())
                            .then(buffer => {
                                office.image = buffer.toString('base64');
                                Office.addOffice(id, office, (err: any, res: any) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(true);
                                    }
                                });
                            })
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
        }*/

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

    public async updateLocation(req: Request): Promise<any> {
        try {
            await this.begin(conn);
            const body = JSON.parse(req.body.body);
            const office: IOffice = {
                city: body.originalOffice.office_location,
                name: body.originalOffice.name,
                address: body.originalOffice.address,
                image: "",
                floors: []
            };
            const originalId = body.originalOffice.office_id;
            const originalCity = body.originalOffice.office_location;
            // load in new edited location values
            const { city, name, address, floors } = body.edits;
            let id = body.originalOffice.office_id;
            if (city !== '') {
                if (city !== office.city) {
                    // find new available ID for new city if the city has been changed
                    const unparsedIDs = await this.getOfficeIDs(city);
                    const IDs: any[] = JSON.parse(JSON.stringify(unparsedIDs));
                    id = this.computeID(IDs);
                }
                office.city = city;
            } if (name !== null) {
                office.name = name;
            } if (address !== null) {
                office.address = address;
            } if (floors !== []) {
                office.floors = [{
                    floor_num: parseInt(floors[0].floor_num, 10),
                    image: (new Buffer('')).toString(),
                    desks: floors[0].desks
                }];
            }
            if (floors[0].desks !== null && floors[0].desks !== undefined && floors[0].desks !== []) {
                // if there is a floor update, check if a matching floor exists
                const floorCheckRes = await this.getFloorsByOfficeId(originalId, originalCity);
                const matchingFloor = floorCheckRes.find((floor) => floor.floor_num === office.floors[0].floor_num);
                if (floorCheckRes === [] || matchingFloor === undefined) {
                    // if a matching floor doesn't exist, user has entered a non-existing floor number that we can't update
                    // TODO: remove this condition- this can't happen anymore because of dispatch(fetchFloorByOffice) in update pop-up
                    return Promise.reject(floorCheckRes);
                } else {
                // confirmed right floor, so update office and desks
                    this.populateUpdateImages(office, req.files, matchingFloor.floor_num);
                    const officeRes = await this.updateOffice(id, office, originalId, originalCity);
                    if (officeRes !== true) {
                        await this.rollback(conn);
                        return Promise.reject(officeRes);
                    } else {
                        const floorRes = await this.updateFloor(office, matchingFloor.floor_num, originalCity, originalId);
                        if (floorRes !== true) {
                            await this.rollback(conn);
                            throw new Error("error in updating floor image")
                        }
                        const originalFloorNum = matchingFloor.floor_num;
                        const deskRes = await this.updateDesks(id, office, originalId, originalCity, originalFloorNum);
                        if (deskRes === true) {
                            await this.end(conn);
                            return Promise.resolve(true);
                        } else {
                            await this.rollback(conn);
                            throw new Error("error at updating desks");
                        }
                    }
                }
            } else {
                // no floor update, so just update the office fields
                this.populateUpdateImages(office, req.files, 0);
                const officeRes = await this.updateOffice(id, office, originalId, originalCity);
                if (officeRes !== true) {
                    await this.rollback(conn);
                    return Promise.reject(officeRes);
                }
                return Promise.resolve(true);
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    private async updateOffice(id: number, office: IOffice, originalId: number, originalCity: string) {
        const image = await Jimp.read(Buffer.from(office.image, 'base64'));
        image.resize(75, 75);
        const compressedImageBuffer = await image.getBufferAsync(image.getMIME());
        office.image = compressedImageBuffer.toString('base64');

        return new Promise((resolve, reject) => {
            Office.updateOffice(id, office, originalId, originalCity, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
    }

    private async getFloorsByOfficeId(originalId: number, originalCity: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            Floor.getAllFloorsByOffice(originalCity, originalId, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res[0]);
                }
            });
        })
    }


    private async updateDesks(id: number, office: IOffice, originalId: number, originalCity: string, originalFloorNum: number) {
        const deskPromises: any[] = [];
        return new Promise((resolve, reject) => {
            Desk.removeDesks(originalId, originalCity, originalFloorNum, (removeErr: any, removeRes: any) => {
                if (removeErr) {
                    return reject(removeErr);
                } else {
                    for (const desk of office.floors[0].desks) {
                        const deskPromise = this.updateDesk(id, office, desk);
                        deskPromises.push(deskPromise);
                    }
                    return Promise.all(deskPromises)
                    .then((res) => {
                        return resolve(true);
                    }).catch((err) => {
                        return reject(err);
                    });
                }})
        });
    }

    private async updateDesk(id: number, office: IOffice, desk: IDesk) {
        return new Promise((resolve, reject) => {
            Desk.addDesk(id, desk, office.floors[0], office, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    private async updateFloor(office: IOffice, floor_num: number, originalCity: string, originalId: number) {
        let floor_image: string = "";
        for (const floor of office.floors) {
            if (floor.floor_num === floor_num) {
                floor_image = floor.image;
            }
        }
        if (floor_image === "") {
            return true; // floor image not found, no need to update
        }

        return new Promise((resolve, reject) => {
            Floor.updateFloorImage(originalCity, originalId, floor_num, floor_image, (err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
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

    private populateUpdateImages(office: IOffice, files: any, floor_num: number) {
        for (const file of files) {
            if (file.fieldname === 'image') {
                office.image = Buffer.from(file.buffer).toString('base64');
            } else if (file.fieldname === 'floor_image') {
                for (const floor of office.floors) {
                    if (floor.floor_num === floor_num) {
                        floor.image = Buffer.from(file.buffer).toString('base64');
                    }
                }
            }
        }
    }
}