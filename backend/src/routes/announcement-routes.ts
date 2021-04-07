import { Router, Request, Response } from 'express';

const router = Router();

import AnnouncementController from '../controllers/announcement-controller';
import {requestIsAdmin} from "../util";
const announcementServer = new AnnouncementController();

router.get('/getCompanyAnnouncements', (req, res: Response) => {
    announcementServer.getCompanyAnnouncements(Number(req.params.startIndex))
        .then((announcements: any) => {
            res.json(announcements);
        })
        .catch((err: any) => {
            res.json(err);
        });
})

router.get('/getAllBranchAnnouncements', (req, res: Response) => {
    announcementServer.getAllBranchAnnouncements()
        .then((announcements: any) => {
            res.json(announcements);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.get('/getBranchAnnouncements/:officeloc/:officeid', (req, res: Response) => {
    announcementServer.getBranchAnnouncements(req.params.officeloc, Number(req.params.officeid))
        .then((desk: any) => {
            res.json(desk);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.post('/postCompanyAnnouncement', (req: Request, res: Response) => {
    if (!requestIsAdmin(req.authInfo)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    }
    else if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    } else {
        announcementServer.postCompanyAnnouncement(req)
            .then((result: any) => {
                res.status(200).send({
                    announcement_id : result
                })
            })
            .catch((err: any) => {
                res.status(401).send({
                    message: err
                });
            })
    }
})

router.post('/postBranchAnnouncement', (req: Request, res: Response) => {
    if (!requestIsAdmin(req.authInfo)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    }
    else if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    } else {
        announcementServer.postBranchAnnouncement(req)
            .then((result: any) => {
                res.status(200).send({
                    announcement_id : result
                })
            })
            .catch((err: any) => {
                res.status(401).send({
                    message: err
                });
            });
    }
});

router.delete('/deleteCompanyAnnouncement', (req: Request, res: Response) => {
    if (!requestIsAdmin(req.authInfo)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        announcementServer.deleteCompanyAnnouncement(req)
            .then((announcement: any) => {
                res.status(200).send();
            })
            .catch((err: any) => {
                res.status(401).send({
                    message: err
                });
            })
    }
})

router.delete('/deleteBranchAnnouncement', (req: Request, res: Response) => {
    if (!requestIsAdmin(req.authInfo)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        announcementServer.deleteBranchAnnouncement(req)
            .then((announcement: any) => {
                res.status(200).send();
            })
            .catch((err: any) => {
                res.status(401).send({
                    message: err
                });
            })
    }
})

export default router;