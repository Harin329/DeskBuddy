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
        .then((result: string) => {
            res.status(200);
            res.json({
                code: result
            });
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

// DELETE removes an ICBC location
router.delete('/:city/:id', (req: Request, res: Response) => {
    const city = req.params.city;
    const id = req.params.id;
    if (city && id) {
        const parsedID = parseInt(id, 10);
        locationServer.deleteLocation(city, parsedID)
            .then((result) => {
                res.status(200);
                res.send();
            }).catch((err: any) => {
                res.status(404).send({
                    message: err
                });
            })
    } else {
        res.status(400);
        res.send();
    }
})

export default router