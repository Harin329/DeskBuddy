import {Request, Response, NextFunction} from 'express';
import {Office} from ''

export default class LocationController {
    // tslint:disable-next-line:no-empty
    constructor() {}

    /*
        Adds an office into the database.
        @param: req is the request, which contains the office in req.body
        @return: promise of type boolean to signify if adding location was successful or not.
    */
    addLocation(req: Request): Promise<boolean> {
        const office: Office = JSON.parse(req.body);
        return new Promise((resolve, reject) => {
            resolve(true);
        })
    }
}