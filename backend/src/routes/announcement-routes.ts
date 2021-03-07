import { Router, Request, Response } from 'express';

const router = Router();

import AnnouncementController from '../controllers/announcement-controller';
const announcementServer = new AnnouncementController();

router.get('/getAnnouncements/:startIndex', (req, res: Response) => {
    announcementServer.getAnnouncements(req.params)
        .then((announcements: any) => {
            res.json(announcements);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.get('/getTotalAnnouncements', (req, res: Response) => {
    announcementServer.getTotalAnnouncements()
        .then((total: any) => {
            res.json(total);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

export default router;