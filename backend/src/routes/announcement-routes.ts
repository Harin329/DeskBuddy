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
        });
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

router.get('/getTotalCompanyAnnouncements', (req, res: Response) => {
    announcementServer.getTotalCompanyAnnouncements()
        .then((total: any) => {
            res.json(total);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.get('/getTotalBranchAnnouncements', (req, res: Response) => {
    announcementServer.getTotalBranchAnnouncements()
        .then((total: any) => {
            res.json(total);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.post('/postCompanyAnnouncement', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }

    announcementServer.postCompanyAnnouncement(req)
        .then((announcement: any) => {
            res.status(200);
            res.send();
        })
        .catch((err: any) => {
            res.status(401).send({
                message: err
            });
        })
})

router.post('/postBranchAnnouncement', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }
    announcementServer.postBranchAnnouncement(req)
        .then((result: any) => {
            res.status(200);
            res.send();
        })
        .catch((err: any) => {
            res.status(401).send({
                message: err
            });
        });
});

export default router;