import { Router, Request, Response, response } from 'express';

const router = Router();

import MailController from '../controllers/mail-controller';
const mailServer = new MailController();

router.post('/', (req: Request, res: Response) => {
    const body = req.body;
    if (body === undefined || body === {}) {
        res.status(400).json({
            err: "Malformed request body"
        })
    } else {
        mailServer.createMail(req.body).then((value: number) => {
            res.status(200).json({
                id: value.toString()
            });
        }).catch((err: any) => {
            res.status(404).json({
                err,
            });
        })
    }
});

router.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (!id) {
        res.status(400).json({
            err: "Malformed request body"
        });
    } else {
        mailServer.deleteMail(id).then((affectedRows: number) => {
            res.status(200).json({
                affectedRows,
            });
        })
    }
});

export default router;