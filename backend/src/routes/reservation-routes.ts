import { Router } from 'express';

const router = Router();

const ReservationController = require('../controllers/reservation-controller');
const reservationServer = new ReservationController();


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

module.exports = router;