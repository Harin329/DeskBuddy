import { Router, Request, Response } from 'express';
import LocationController from '../controllers/location-controller';
import multer from 'multer';

const router = Router();
const locationServer = new LocationController();
const upload = multer();

// POST creates new ICBC office location
router.post('/', upload.any(), (req: any, res: Response) => {
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
            res.status(404).send({
                message: err
            });
        });
});

// DELETE removes an ICBC location
router.delete('/:city/:id', (req: Request, res: Response) => {
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
})

router.put('/', (req: Request, res: Response) => {
    locationServer.updateLocation(req)
        .then((result) => {
            res.status(200).send(result.toString());
        })
        .catch((err: any) => {
            res.status(500).send({
                message: err
            });
        })
})

export default router