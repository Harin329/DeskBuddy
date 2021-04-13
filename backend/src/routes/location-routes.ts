import { Router, Request, Response } from 'express';
import LocationController from '../controllers/location-controller';
import multer from 'multer';
import {requestIsAdmin} from "../util";

const router = Router();
const locationServer = new LocationController();
const upload = multer();

// POST creates new ICBC office location
router.post('/', upload.any(), (req: any, res: Response) => {
    if (!requestIsAdmin(req.authInfo)){
        res.status(401).json({
            err: 'Unauthorized'
        });
    } else if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    } else {
        locationServer.addLocation(req)
            .then((result: string) => {
                res.status(200);
                res.json({
                    code: result
                });
            })
            .catch((err) => {
                res.status(400).send({
                    message: err
                });
            });
    }
});

// DELETE removes an ICBC location
router.delete('/:city/:id', (req: Request, res: Response) => {
    if (!requestIsAdmin(req.authInfo)){
        res.status(401).json({
            err: 'Unauthorized'
        });
    } else {
        const city = req.params.city;
        const id = req.params.id;
        if (city && id) {
            const parsedID = parseInt(id, 10);
            locationServer.deleteLocation(city, parsedID)
                .then((result) => {
                    res.status(200).send(result.toString());
                }).catch((err: any) => {
                res.status(404).send({
                    message: err
                });
            })
        } else {
            res.status(400);
            res.send();
        }
    }
})

router.put('/', upload.any(), (req: Request, res: Response) => {
    if (!requestIsAdmin(req.authInfo)){
        res.status(401).json({
            err: 'Unauthorized'
        });
    } else {
        locationServer.updateLocation(req)
            .then((result) => {
                res.status(200).send(result.toString());
            })
            .catch((err: any) => {
                res.status(500).send({
                    message: err
                });
            })
    }
})

export default router