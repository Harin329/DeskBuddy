import { Router, Request, Response } from 'express';
import multer from 'multer';

const router = Router();

import ChannelController from '../controllers/channel-controller';
import {requestIsAdmin} from "../util";
const channelServer = new ChannelController();

const upload = multer();

router.get('/', (req: Request, res: Response) => {
    const isAdmin = requestIsAdmin(req.authInfo);
    channelServer.getChannelForEmployee(isAdmin)
        .then((channels: any) => {
            res.json(channels);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.delete('/', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }
    channelServer.deleteChannel(req.body)
        .then((response: any) => {
            res.json(response);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.post('/', upload.any(), (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }
    channelServer.addChannel(req)
        .then((channel: any) => {
            res.status(200).json(channel);
        })
        .catch((err: any) => {
            res.json(err);
        });
});

export default router