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
  Author([RoleEnum.CUSTOMER]),
  validate(createBookingSchema),
  bookingController.createBooking
);
bookingRouter.post(
  '/competition',
  Author([RoleEnum.CUSTOMER]),
  bookingController.createCompetionBooking
);
bookingRouter.get('/', bookingController.getAllBooking);
bookingRouter.get(
  '/GetAllBookingOfCourt/:court',
  bookingController.getAllBookingOfCourt
);
bookingRouter.get(
  '/GetBookingByStatus/:status',
  Author([RoleEnum.CUSTOMER]),
  bookingController.getBookingByStatus
);
bookingRouter.put(
  '/UpdateBookingAfterPayment/:bookingId',
  bookingController.updateBookingAfterPayment
);
bookingRouter.get(
  '/MyBooking',
  Author([RoleEnum.CUSTOMER]),
  bookingController.getBookingOfCustomer
);
bookingRouter.get(
  '/BookingReceipt',
  Author([RoleEnum.CUSTOMER]),
  bookingController.getAllBookingDetailOfCustomer
);
bookingRouter.get('/:id', bookingController.getBookingById);
bookingRouter.post('/cancel/:id', bookingController.cancelBooking);
bookingRouter.put(
  '/done/:id',
  Author([RoleEnum.MANAGER, RoleEnum.STAFF]),
  bookingController.doneBooking
);
bookingRouter.post('/search', bookingController.searchBooking);

export default bookingRouter;
