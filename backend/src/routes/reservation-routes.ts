import { Router } from 'express';

const router = Router();

import ReservationController from '../controllers/reservation-controller';
const reservationServer = new ReservationController();

// POST reserve desk endpoint
router.post('/', (req, res) => {
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
router.get('/getAllReservations', (_, res) => {
    reservationServer.findAllReservations()
    .then((reservations: any) => {
        res.json(reservations);
    })
    .catch((err: any) => {
        res.json(err);
    })
})

export default router