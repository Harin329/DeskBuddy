import { Request, Response, NextFunction } from 'express';
import { IOffice, IFloor, IDesk } from '../interfaces/location.interface';
import { Desk } from '../models/desk';
import { Floor } from '../models/floor';
import { Office } from '../models/office';
import fs from 'fs';


export default class LocationController {
    // tslint:disable-next-line:no-empty
    constructor() { }

    /*
        Adds an office into the database.
        @param: req is the request, which contains the office in req.body
        @return: promise of type boolean to signify if adding location was successful or not.
    */
    public async addLocation(req: Request): Promise<boolean> {
        try {
            const office: IOffice = req.body;
            if (office.image === null) {
                office.image = fs.readFileSync("src/images/defaultBuildingImage.jpg");
            }
            for (const floor in office.floors) {
                if (office.floors[floor].image === null) {
                    office.floors[floor].image = fs.readFileSync("src/images/defaultFloorPlanImage.jpg");
                }
            }
            const unparsedIDs = await this.getOfficeIDs(office.city);
            const IDs: any[] = JSON.parse(JSON.stringify(unparsedIDs));
            const availableID = this.computeID(IDs);
            const officeRes = await this.addOffice(availableID, office);
            if (officeRes !== true) {
                return Promise.reject(false);
            }
            const floorRes = await this.addFloors(availableID, office);
            if (floorRes !== true) {
                return Promise.reject(false);
            }
            const deskRes = await this.addDesks(availableID, office);
            if (deskRes !== true) {
                return Promise.reject(false);
            }
            return Promise.resolve(true);
        } catch (err) {
            console.log(err);
            return Promise.reject(false);
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
            return Promise.reject(err);
        });
    }

    private async addFloor(id: number, floor: IFloor, office: IOffice) {
        return new Promise((resolve, reject) => {
            Floor.addFloor(id, floor, office, (err: any, res: any) => {
                if (err) {
                    reject(err);
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
            return Promise.reject(err);
        });
    }

    private async addDesk(id: number, desk: IDesk, floor: IFloor, office: IOffice) {
        return new Promise((resolve, reject) => {
            Desk.addDesk(id, desk, floor, office , (err: any, res: any) => {
                if (err) {
                    reject(err);
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
}