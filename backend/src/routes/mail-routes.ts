import { Router, Request, Response, response } from 'express';

const router = Router();

import MailController from '../controllers/mail-controller';
import { IMail, IMailResponse } from '../interfaces/mail.interface';
const mailServer = new MailController();

const filterTypes = {
    New: "new",
    AwaitAdmin: "await_admin",
    AwaitEmployee: "await_employee",
    Closed: "closed",
    CannotComplete: "cannot_complete"
}

// default is descending

const sortTypes = {
    modifiedAscending: "+modified_at",
    modifiedDescending: "-modified_at",
}

router.get('/:employeeID', (req: Request, res: Response) => {
    const employeeID = req.params.employeeID;
    const filter = req.query.filter;
    const sort = req.query.sort;
    const loc = req.query.locname;
    const id = req.query.locid;
    // if it is not a string or undefined, or a string
    if (typeof filter !== "undefined" &&
        (typeof filter !== "string" || !Object.values(filterTypes).includes(filter))) {
        res.status(400).json({
            err: "Bad filter"
        });
    }
    // same thing for sort
    else if (typeof sort !== "undefined" &&
        (typeof sort !== "string" || !Object.values(sortTypes).includes(sort))) {
        res.status(400).json({
            err: "Bad sort"
        });
    }
    else if (typeof loc !== "undefined" && typeof loc !== "string") {
        res.status(400).json({
            err: "Bad office location"
        });
    }
    else if (typeof id !== "undefined" && typeof id !== "string") {
        res.status(400).json({
            err: "Bad office id"
        });
    }
    else if (!employeeID) {
        res.status(400).json({
            err: "Malformed employeeID body"
        });
    } else {
        mailServer.getMail(employeeID,
            filter as string | undefined,
            sort as string | undefined,
            loc as string | undefined,
            id as string | undefined).then((mailInfo: IMailResponse[]) => {
            res.status(200).json({
                mails: mailInfo
            });
        }).catch((err: any) => {
            res.status(404).json({
                err,
            })
        })
    }
})

router.post('/', (req: Request, res: Response) => {
    const body = req.body;
    if (body === undefined || body === {}) {
        res.status(400).json({
            err: "Malformed request body"
        });
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

router.post('/CreateMailRequest', (req: Request, res: Response) => {
    const body = req.body;
    if (body === undefined || body === {}) {
        res.status(400).json({
            err: "Malformed request body"
        })
    } else {
        mailServer.createMailRequest(req.body).then((value: any) => {
            res.status(200).json({
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

const getMailCheckFieldValidity = (req: any) => {
    return req
}

export default router;