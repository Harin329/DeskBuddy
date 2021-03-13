import { Router, Request, Response } from 'express';

const router = Router();

import PostController from '../controllers/post-controller';
const postServer = new PostController();

// GET all posts from given category/group channel
router.get('/getFeedByCategory/:category', (req: Request, res: Response) => {
    postServer.findPostByCategory(Number(req.params.category))
    .then((posts: any) => {
        res.json(posts);
    })
    .catch((err: any) => {
        res.json(err);
    })
})

// POST creates new post under given category
router.post('/createPost', (req: any, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Empty body...'
        });
    }

    postServer.createPost(req)
        .then((post: any) => {
            res.json(post);
    })
    .catch((err: any) => {
        res.json(err);
    })
});

// POST updates flag status of post
router.post('/flagPost', (req: any, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'empty body'
        });
    }

    postServer.flagPost(req)
        .then((post: any) => {
            res.json(post);
        })
        .catch((err: any) => {
            res.json(err);
    })
})

// DELETE post
router.delete('/deletePost', (req: any, res: Response) => {
    if (!req.body.post_id) {
        res.status(400).send({
            message: 'no post id'
        })
    }

    postServer.deletePost(req)
        .then((post: any) => {
            res.json(post);
        })
        .catch((err: any) => {
            res.json(err)
        });
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