import { Router, Request, Response } from 'express';

const router = Router();

import OfficeController from '../controllers/office-controller';
const officeServer = new OfficeController();


// GET all offices
router.get('/getAllOffices', (_, res: Response) => {
    officeServer.findAllOffices()
    .then((office: any) => {
        res.json(office);
    })
    .catch((err: any) => {
        res.json(err);
    })
})

export default router