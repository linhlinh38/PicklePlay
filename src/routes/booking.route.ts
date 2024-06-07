import express from 'express';
import bookingController from '../controllers/booking.controller';

const bookingRouter = express.Router();
bookingRouter.post('/', bookingController.createBooking);
export default bookingRouter;
