import { Router, Request, Response } from 'express';

const router = Router();

import RequestController from "../controllers/request-controller";
import {requestIsAdmin} from "../util";
const requestServer = new RequestController();



// endpoint for creating a new request
router.post('/', (req: Request, res: Response) => {
    // console.log(req.authInfo);
    if (!req.body) {
        res.status(400).json({
            message: "Malformed request body"
        });
    }
    else {
        requestServer.createRequest(req)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.json(err);
            });
    }
});

// endpoint for getting all request for an employee
router.get('/:employeeID', (req: Request, res: Response) => {
    if (req.params.employeeID === null) {
        res.status(400).json({
            message: "must provide an employee_ID"
        });
    }
    else {
        requestServer.getAllRequests(req.params.employeeID)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            });
    }
});

// endpoint for closing a request
router.put('/close', (req: Request, res: Response) => {
    if (!req.body || !req.body.mail_id) {
        res.status(400).json({
            message: "malformed request body"
        });
    }
    else {
        requestServer.closeRequest(req)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.status(400).json(err);
            });
    }
});

// endpoint for updating a request for employee
router.put('/employee', (req: Request, res: Response) => {
    if (!req.body || req.body.mail_id === null) {
        res.status(400).json({
            message: "malformed request body"
        })
    }
    else {
        requestServer.updateRequestEmployee(req)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.status(400).json(err);
            })
    }
});

// endpoint for updating a request for admin
router.put('/admin', (req: Request, res: Response) => {
    if (!req.body || req.body.mail_id == null) {
        console.log(req.body.mail_id)
        res.status(400).json({
            message: "malformed request body"
        })
    }
    else {
        requestServer.updateRequestAdmin(req)
            .then((result: any) => {
                console.log(result);
                res.json(result);
            })
            .catch((err: any) => {
                res.status(400).json(err);
            })
    }
});

export default router;