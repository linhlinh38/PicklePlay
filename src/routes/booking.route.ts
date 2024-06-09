import express from 'express';
import bookingController from '../controllers/booking.controller';

const bookingRouter = express.Router();
bookingRouter.post('/', bookingController.createBooking);
bookingRouter.get('/', bookingController.getAllBooking);
bookingRouter.get(
  '/GetAllBookingOfCourt/:court',
  bookingController.getAllBookingOfCourt
);
bookingRouter.get(
  '/GetBookigByStatus/:status',
  bookingController.getBookigByStatus
);
bookingRouter.get('/:id', bookingController.getBookingById);
bookingRouter.post('/cancel/:id', bookingController.cancelBooking);
export default bookingRouter;
