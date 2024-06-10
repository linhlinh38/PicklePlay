import { NextFunction, Request, Response } from 'express';
import { BookingStatusEnum, BranchStatusEnum } from '../utils/enums';
import { IBooking } from '../interfaces/booking.interface';
import { bookingService } from '../services/booking.service';
import { AuthRequest } from '../middlewares/authentication';
import moment from 'moment';
import { scheduleService } from '../services/schedule.service';

async function createBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { booking, schedule } = req.body;
  try {
    await bookingService.createBooking(booking, schedule, req.loginUser);
    return res.status(201).json({ message: 'Created Booking Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllBooking(req: Request, res: Response) {
  const booking = await bookingService.getAll();
  return res.status(200).json({ bookingList: booking });
}

async function getBookigByStatus(req: AuthRequest, res: Response) {
  const key: Partial<IBooking> = {
    customer: req.loginUser,
    status: req.params.status
  };
  const booking = await bookingService.search(key);
  return res.status(200).json({ bookingList: booking });
}

async function getAllBookingOfCourt(req: AuthRequest, res: Response) {
  const key: Partial<IBooking> = {
    court: req.params.court
  };
  const booking = await bookingService.search(key);
  return res.status(200).json({ bookingList: booking });
}

async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.getById(req.params.id);
    return res.status(200).json({ booking: booking });
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.getById(req.params.id);
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
  getBookigByStatus,
  getAllBookingOfCourt,
  cancelBooking
};
