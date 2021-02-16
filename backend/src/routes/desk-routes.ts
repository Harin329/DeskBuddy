import { Router, Request, Response } from 'express';

const router = Router();

import DeskController from '../controllers/desk-controller';
const deskServer = new DeskController();

// Get all desks at given office
router.get('/getDesksByOffice/:officeloc/:officeid', (req: Request, res: Response) => {
    deskServer.findDeskByOffice(req.params.officeloc, Number(req.params.officeid))
    .then((desk: any) => {
        res.json(desk);
    })
    .catch((err: any) => {
        res.json(err);
    })
})

export default router