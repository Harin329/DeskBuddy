import { Router, Request, Response } from 'express';
import LocationController from '../controllers/location-controller';

const router = Router();
const locationServer = new LocationController();

// POST creates new ICBC office location
router.post('/', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }
    locationServer.addLocation(req)
        .then((result: boolean) => {
            res.status(200);
            res.send();
        })
        .catch((err) => {
            res.status(401).send({
                message: err
            });
        });
});

// GET all ICBC office locations
router.get('/', (_, res: Response) => {
    // TODO
})

export default router