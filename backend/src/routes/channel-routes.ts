import { Router, Request, Response } from 'express';
import config from '../config.json';

const router = Router();

import ChannelController from '../controllers/channel-controller';
const channelServer = new ChannelController();

router.get('/', (req: Request, res: Response) => {
    let isAdmin = false;
    // @ts-ignore
    // tslint:disable-next-line:forin
    for (const i in req.authInfo.groups) {
        // @ts-ignore
        if (req.authInfo.groups[i] === config.credentials.adminGroup) {
            isAdmin = true;
        }
    }
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

export default router