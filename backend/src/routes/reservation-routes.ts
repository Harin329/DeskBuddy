import { Router, Request, Response } from 'express';

const router = Router();

import ReservationController from '../controllers/reservation-controller';
const reservationServer = new ReservationController();

// POST reserve desk endpoint
router.post('/', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }

    reservationServer.createReservation(req)
        .then((reservation: any) => {
            res.json(reservation);
        })
        .catch((err: any) => {
            res.json(err);
        });
});

// GET all reservations, to test connections & setup
router.get('/getAllReservations', (_, res: Response) => {
    reservationServer.findAllReservations()
    .then((reservations: any) => {
        res.json(reservations);
    })
    .catch((err: any) => {
        res.json(err);
    })
})

// GET upcoming reservations from current date
router.get('/upcoming', (_, res: Response) => {
    reservationServer.findUpcomingReservations()
        .then((reservations: any) => {
            res.json(reservations);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

// GET reservation matching a given date
router.get('/upcoming/:date', (req, res: Response) => {
    console.log(req.params);
    reservationServer.getReservationByDate(req.params)
        .then((reservation: any) => {
            res.json(reservation);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

// COUNT # of reservations for an office
router.get("/count/:officeID/:startDate/:endDate", (req, res: Response) => {
    reservationServer.countEmployees(req.params)
        .then((count: any) => {
            res.json(count);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

// DELETE reservation by reservation_id
router.delete('/deleteReservation', (req, res) => {
    if (!req.body.reservation_id) {
        res.status(400).send({
            message: 'Must provide a reservation_id!'
        });
    } else {
        reservationServer.deleteReservation(req)
            .then((status: any) => {
                res.json(status);
            })
            .catch((err: any) => {
                res.json(err);
            })
    }
})



export default router