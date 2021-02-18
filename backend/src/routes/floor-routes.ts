import { Router, Request, Response } from 'express';

const router = Router();

import FloorController from '../controllers/floor-controller';
const floorServer = new FloorController();

// Get all floor at given office
router.get('/getFloorsByOffice/:officeloc/:officeid', (req: Request, res: Response) => {
    floorServer.findFloorByOffice(req.params.officeloc, Number(req.params.officeid))
    .then((floor: any) => {
        res.json(floor);
    })
    .catch((err: any) => {
        res.json(err);
    })
})

export default router