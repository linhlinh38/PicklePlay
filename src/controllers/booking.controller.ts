import { NextFunction, Request, Response } from 'express';
import {
  BookingPaymentType,
  BookingStatusEnum,
  PaymentMethodEnum,
  ScheduleStatusEnum,
  TransactionTypeEnum
} from '../utils/enums';
import { IBooking } from '../interfaces/booking.interface';
import { bookingService } from '../services/booking.service';
import { AuthRequest } from '../middlewares/authentication';
import moment from 'moment';
import { scheduleService } from '../services/schedule.service';
import { userService } from '../services/user.service';
import { sendBookingBillEmail } from '../services/mail.service';
import { ITransaction } from '../interfaces/transaction.interface';
import { transactionService } from '../services/transaction.service';

async function createBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { booking, schedule, transaction } = req.body;
  try {
    const { result, relativePath } = await bookingService.createBooking(
      booking,
      schedule,
      transaction,
      req.loginUser
    );
    if (result._id) {
      const user = await userService.getById(req.loginUser);
      await sendBookingBillEmail(result, user, relativePath);
    }

    return res.status(201).json({ message: 'Created Booking Successfully!' });
  } catch (error) {
    next(error);
  }
}

async function createCompetionBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { courtArray, booking, schedule, transaction } = req.body;
  try {
    const { result, relativePath } =
      await bookingService.createCompetionBooking(
        courtArray,
        booking,
        schedule,
        transaction,
        req.loginUser
      );
    if (result._id) {
      const user = await userService.getById(req.loginUser);
      await sendBookingBillEmail(result, user, relativePath);
    }
    return res.status(201).json({ message: 'Created Booking Successfully!' });
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

async function searchBooking(req: Request, res: Response) {
  const key: Partial<IBooking> = req.body;
  const booking = await bookingService.search(key);
  return res
    .status(200)
    .json({ message: 'Get booking success', data: booking });
}

async function getBookingByStatus(req: AuthRequest, res: Response) {
  const customer = req.loginUser;
  const status = req.params.status;
  const booking = await bookingService.getBookingByStatus(customer, status);
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

    const momentNow = moment();
    const createAt = moment(booking.createdAt);
    const duration = momentNow.diff(createAt, 'minutes');
    if (Math.abs(duration) > 15) {
      const cancellationDeadline = startDate.clone().subtract(2, 'days');
      if (today.isAfter(cancellationDeadline)) {
        return res.status(400).json({
          message:
            'Cannot Cancel Booking: Booking must be cancelled 2 days before start date'
        });
      }
    }

    await bookingService.update(booking._id, {
      status: BookingStatusEnum.CANCELLED
    });

    schedules.map(async (schedule) => {
      return await scheduleService.delete(schedule._id);
    });

    if (booking.paymentType === BookingPaymentType.FULL) {
      const transactionDTO: ITransaction = {
        amount: booking.totalPrice / 2,
        from: '66582c259a27f983f5bd6700',
        to: booking.customer as string,
        type: TransactionTypeEnum.REFUND,
        payment: req.body.paymentId,
        paymentMethod: PaymentMethodEnum.LINKED_ACCOUNT
      };
      await transactionService.createTransaction(transactionDTO);
    }

    return res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
}

async function doneBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.getById(req.params.id);
    if (!booking || booking.status !== BookingStatusEnum.BOOKED)
      return res.status(400).json({ message: 'Booking cannot change to done' });
    const schedules = await scheduleService.search({ booking: booking._id });

    await bookingService.update(booking._id, {
      status: BookingStatusEnum.DONE
    });

    if (schedules.length > 0) {
      schedules.map(async (schedule) => {
        return await scheduleService.update(schedule._id, {
          status: ScheduleStatusEnum.DONE
        });
      });
    }

    return res.status(200).json({ message: 'Booking is done' });
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
  updateBookingStatus,
  searchBooking,
  doneBooking,
  createCompetionBooking
};
