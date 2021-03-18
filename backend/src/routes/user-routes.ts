import { Router, Request, Response } from 'express';

const router = Router();

import UserController from '../controllers/user-controller';
import {oidMatchesRequest} from "../util";
const userServer = new UserController();

// POST user endpoint. creates or updates user in database using Azure AD account info
router.post('/', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
        return;
    }
    if (!oidMatchesRequest(req.authInfo, req.body.oid)) {
        res.status(401).send({
            message: 'Unauthorized. requested oid does not match authenticated oid.'
        });
        return;
    }
    userServer.insertUser(req)
        .then((user: any) => {
            res.json(user);
        })
        .catch((err: any) => {
            res.json(err);
        });
})

export default router