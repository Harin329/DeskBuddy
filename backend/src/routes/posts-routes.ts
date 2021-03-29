import { Router, Request, Response } from 'express';

const router = Router();

import PostController from '../controllers/post-controller';
import {oidMatchesRequest, requestIsAdmin} from "../util";
const postServer = new PostController();

// GET all posts from given category/group channel
router.get('/getFeedByCategory/:category', (req: Request, res: Response) => {
    if (!req.params.category) {
        res.status(400).json({
            err: 'Malformed params'
        });
    } else if (Number(req.params.category) === 0 && !requestIsAdmin(req.authInfo)) {
        res.status(401).json({
            err: 'Unauthorized'
        });
    } else {
        postServer.findPostByCategory(Number(req.params.category))
            .then((posts: any) => {
                res.status(200).json(posts);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            })
    }
})

// POST creates new post under given category
router.post('/createPost', (req: any, res: Response) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            err: 'Empty body'
        });
    } else if (req.body.employee_id === undefined || req.body.channel_id === undefined || req.body.post_content === undefined) {
        res.status(400).json({
            err: 'Malformed body'
        });
    } else if (req.body.channel_id === 0 && !requestIsAdmin(req.authInfo)) {
        res.status(401).json({
            err: 'Unauthorized'
        });
    } else if (!oidMatchesRequest(req.authInfo, req.body.employee_id)) {
        res.status(401).json({
            err: 'Unauthorized'
        });
    } else {
        postServer.createPost(req)
            .then((post: any) => {
                res.status(200).json(post);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            })
    }
});

// POST updates flag status of post
router.post('/flagPost', (req: any, res: Response) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            err: 'Empty body'
        });
    } else if (req.body.post_id === undefined) {
        res.status(400).json({
            err: 'Malformed body'
        });
    } else {
        postServer.flagPost(req)
            .then((post: any) => {
                res.status(200).json(post);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            })
    }
})

router.post('/unreportPost', (req: any, res: Response) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            err: 'Empty body'
        });
    } else if (req.body.post_id === undefined) {
        res.status(400).json({
            err: 'Malformed body'
        });
    } else if (!requestIsAdmin(req.authInfo)) {
        res.status(401).json({
            err: 'Unauthorized'
        });
    } else {
        postServer.unreportPost(req)
            .then((post: any) => {
                res.status(200).json(post);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            });
    }
});

// DELETE post
router.delete('/deletePost', (req: any, res: Response) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            err: 'Empty body'
        });
    } else if (req.body.post_id === undefined) {
        res.status(400).json({
            err: 'Malformed body'
        });
    } else {
        postServer.deletePost(req, requestIsAdmin(req.authInfo))
            .then((post: any) => {
                res.status(200).json(post);
            })
            .catch((err: any) => {
                res.status(404).json(err)
            });
    }
})

export default router;





















// // Get all desks at given office
// router.get('/getDesksByOffice/:officeloc/:officeid', (req: Request, res: Response) => {
//     deskServer.findDeskByOffice(req.params.officeloc, Number(req.params.officeid))
//     .then((desk: any) => {
//         res.json(desk);
//     })
//     .catch((err: any) => {
//         res.json(err);
//     })
// })

// router.post('/getOpenDesks', (req: Request, res: Response) => {
//     if (!req.body) {
//         res.status(400).send({
//             message: 'Content can not be empty!'
//         });
//     }

//     deskServer.getOpenDesks(req)
//     .then((desk: any) => {
//         res.json(desk);
//     })
//     .catch((err: any) => {
//         res.json(err);
//     })
// })