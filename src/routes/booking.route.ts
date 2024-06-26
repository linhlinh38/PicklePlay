import express from 'express';
import authentication from '../middlewares/authentication';
import bookingController from '../controllers/booking.controller';
import validate from '../utils/validate';
import { createBookingSchema } from '../models/validateSchema/createBooking.validate.schema';
import { Author } from '../middlewares/authorization';
import { RoleEnum } from '../utils/enums';

const bookingRouter = express.Router();
bookingRouter.use(authentication);
bookingRouter.post(
  '/',
  validate(createBookingSchema),
  bookingController.createBooking
);
bookingRouter.get('/', bookingController.getAllBooking);
bookingRouter.get(
  '/GetAllBookingOfCourt/:court',
  bookingController.getAllBookingOfCourt
);
bookingRouter.get(
  '/GetBookingByStatus/:status',
  bookingController.getBookigByStatus
);
bookingRouter.get(
  '/get-own',
  Author([RoleEnum.CUSTOMER]),
  bookingController.getOwnBooking
);
bookingRouter.get('/:id', bookingController.getBookingById);
bookingRouter.post('/cancel/:id', bookingController.cancelBooking);

export default bookingRouter;
