import express from 'express';
import authentication from '../middlewares/authentication';
import bookingController from '../controllers/booking.controller';

const bookingRouter = express.Router();
bookingRouter.use(authentication);
bookingRouter.post('/', bookingController.createBooking);
bookingRouter.get('/', bookingController.getAllBooking);
bookingRouter.get(
  '/GetAllBookingOfCourt/:court',
  bookingController.getAllBookingOfCourt
);
bookingRouter.get(
  '/GetBookingByStatus/:status',
  bookingController.getBookigByStatus
);
bookingRouter.get('/:id', bookingController.getBookingById);
bookingRouter.post('/cancel/:id', bookingController.cancelBooking);
export default bookingRouter;
