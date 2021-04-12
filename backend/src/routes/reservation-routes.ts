import { Router, Request, Response } from 'express';

const router = Router();

import ReservationController from '../controllers/reservation-controller';
import {oidMatchesRequest, requestIsAdmin} from "../util";
const reservationServer = new ReservationController();

// POST reserve desk endpoint
router.post('/', (req: Request, res: Response) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({
            err: 'Empty body'
        });
    } else if (!oidMatchesRequest(req.authInfo, req.body.employee_id)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        reservationServer.createReservation(req)
            .then((reservation: any) => {
                res.status(200).json({
                    reservation_id : reservation
                })
            })
            .catch((err: any) => {
                res.status(404).json(err);
            });
    }
});

router.post('/range', (req: Request, res: Response) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({
            err: 'Empty body'
        });
    } else if (!oidMatchesRequest(req.authInfo, req.body.employee_id)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        reservationServer.createReservationRange(req)
            .then((reservations: any[]) => {
                res.status(200).json({
                    reservation_ids : reservations
                })
            })
            .catch((err: any) => {
                res.status(404).json(err);
            });
    }
});

// GET all reservations, to test connections & setup
router.get('/getAllReservations', (req, res: Response) => {
    if (!requestIsAdmin(req.authInfo)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        reservationServer.findAllReservations()
            .then((reservations: any) => {
                res.json(reservations);
            })
            .catch((err: any) => {
                res.json(err);
            })
    }
})

// GET upcoming reservations from current date from a user
router.get('/upcomingByUID/:userID', (req, res: Response) => {
    if (!oidMatchesRequest(req.authInfo, req.params.userID)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        reservationServer.findUpcomingReservations(req.params)
            .then((reservations: any) => {
                res.status(200).json(reservations);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            })
    }
})

// GET reservation matching a given date
router.get('/upcoming/:date/:userID', (req, res: Response) => {
    if (!oidMatchesRequest(req.authInfo, req.params.userID)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        reservationServer.getReservationByDate(req.params)
            .then((reservation: any) => {
                res.status(200).json(reservation);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            })
    }
})

// GET reservation this month
router.get('/month/:userID', (req, res: Response) => {
    if (!oidMatchesRequest(req.authInfo, req.params.userID)) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        reservationServer.getReservationByMonth(req.params)
            .then((reservation: any) => {
                res.status(200).json(reservation);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            })
    }
})

// COUNT # of reservations for an office
router.get("/count/:officeID/:officeLocation/:startDate/:endDate", (req, res: Response) => {
    reservationServer.countEmployees(req.params)
        .then((count: any) => {
            res.status(200).json(count);
        })
        .catch((err: any) => {
            res.status(404).json(err);
        })
})

// DELETE reservation by reservation_id
router.delete('/deleteReservation', (req, res) => {
    reservationServer.deleteReservation(req, requestIsAdmin(req.authInfo))
        .then((status: any) => {
            res.status(200).json(status);
        })
        .catch((err: any) => {
            res.status(404).json(err);
        })
})

export default router