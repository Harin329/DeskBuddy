import { Router, Request, Response } from 'express';

const router = Router();

import MailController from '../controllers/mail-controller';
const mailServer = new MailController();


// router.get('/getFeedByCategory/:category', (req: Request, res: Response) => {
//     postServer.findPostByCategory(Number(req.params.category))
//     .then((posts: any) => {
//         res.json(posts);
//     })
//     .catch((err: any) => {
//         res.json(err);
//     })
// })

export default router;