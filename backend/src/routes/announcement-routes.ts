import { Router, Request, Response } from 'express';

const router = Router();

import AnnouncementController from '../controllers/announcement-controller';
const announcementServer = new AnnouncementController();

router.get('/getCompanyAnnouncements/:startIndex', (req, res: Response) => {
    announcementServer.getCompanyAnnouncements(Number(req.params.startIndex))
        .then((announcements: any) => {
            res.json(announcements);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.get('/getAllBranchAnnouncements/:startIndex', (req, res: Response) => {
    announcementServer.getAllBranchAnnouncements(Number(req.params.startIndex))
        .then((announcements: any) => {
            res.json(announcements);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.get('/getBranchAnnouncements/:startIndex/:officeloc/:officeid', (req, res: Response) => {
    announcementServer.getBranchAnnouncements(req.params.officeloc, Number(req.params.officeid), Number(req.params.startIndex))
        .then((desk: any) => {
            res.json(desk);
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