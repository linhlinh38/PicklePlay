import { NextFunction, Request, Response } from 'express';
import { BookingStatusEnum } from '../utils/enums';
import { IBooking } from '../interfaces/booking.interface';
import { bookingService } from '../services/booking.service';
import { AuthRequest } from '../middlewares/authentication';
import moment from 'moment';
import { scheduleService } from '../services/schedule.service';
import { userService } from '../services/user.service';
import { sendBookingBillEmail } from '../services/mail.service';

async function createBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { booking, schedule } = req.body;
  try {
    const result = await bookingService.createBooking(
      booking,
      schedule,
      req.loginUser
    );

    return res.status(201).json({ message: 'Created Booking Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllBooking(req: Request, res: Response) {
  const booking = await bookingService.getAll();
  return res
    .status(200)
    .json({ message: 'Get all booking success', data: booking });
}

async function getBookingByStatus(req: AuthRequest, res: Response) {
  const key: Partial<IBooking> = {
    customer: req.loginUser,
    status: req.params.status
  };
  const booking = await bookingService.search(key);
  return res
    .status(200)
    .json({ message: 'Get booking success', data: booking });
}

async function getBookingOfCustomer(req: AuthRequest, res: Response) {
  const booking = await bookingService.getBookingByCustomer(req.loginUser);
  return res
    .status(200)
    .json({ message: 'Get booking success', data: booking });
}

async function getAllBookingOfCourt(req: AuthRequest, res: Response) {
  const key: Partial<IBooking> = {
    court: req.params.court
  };
  const booking = await bookingService.search(key);
  return res
    .status(200)
    .json({ message: 'Get booking success', data: booking });
}

async function updateBookingAfterPayment(req: AuthRequest, res: Response) {
  const bookingId = req.params.bookingId;
  const paymentResult = req.body.paymentResult;
  const { result, relativePath } =
    await bookingService.updateBookingAfterPayment(paymentResult, bookingId);
  if (result._id) {
    const user = await userService.getById(req.loginUser);
    await sendBookingBillEmail(result, user, relativePath);
  }
  return res
    .status(200)
    .json({ message: 'Update booking success', data: result });
}

async function updateBookingStatus(req: AuthRequest, res: Response) {
  const bookingId = req.params.bookingId;
  const booking = await bookingService.update(bookingId, {
    status: BookingStatusEnum.DONE
  });
  return res
    .status(200)
    .json({ message: 'Update booking success', data: booking });
}

async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.getById(req.params.id);
    return res
      .status(200)
      .json({ message: 'Get booking success', data: booking });
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.getById(req.params.id);
    if (booking == null)
      return res.status(400).json({ message: 'Booking not found' });
    const schedules = await scheduleService.search({ booking: booking._id });
    if (!booking) {
      return res.status(400).json({ message: 'Booking not found!' });
    }

    const today = moment();
    const startDate = moment(booking.startDate);

    const cancellationDeadline = startDate.clone().subtract(2, 'days');
    if (today.isAfter(cancellationDeadline)) {
      return res.status(400).json({
        message:
          'Cannot Cancel Booking: Booking must be cancelled 2 days before start date'
      });
    }
    await bookingService.update(booking._id, {
      status: BookingStatusEnum.CANCELLED
    });

    schedules.map(async (schedule) => {
      return await scheduleService.delete(schedule._id);
    });
    return res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
}

export default {
  createBooking,
  getAllBooking,
  getBookingById,
  getBookingByStatus,
  getBookingOfCustomer,
  getAllBookingOfCourt,
  cancelBooking,
  updateBookingAfterPayment,
  updateBookingStatus
};
