import { NextFunction, Request, Response } from 'express';
import { BookingStatusEnum, BranchStatusEnum } from '../utils/enums';
import { IBooking } from '../interfaces/booking.interface';
import { bookingService } from '../services/booking.service';

async function createBooking(req: Request, res: Response, next: NextFunction) {
  const newBooking = {
    // type: req.body.type,
    // paymentType: req.body.paymentType,
    // paymentMethod: req.body.paymentMethod,
    // totalPrice: req.body.totalPrice,
    // totalHour: req.body.totalHour,
    // startDate: req.body.startDate,
    // endDate: req.body.endDate,
    // status: BookingStatusEnum.PENDING,
    // manager: req.body.manager
  };

  const { booking, schedule } = req.body;
  try {
    await bookingService.createBooking(booking, schedule);
    return res.status(201).json({ message: 'Created Booking Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllBooking(req: Request, res: Response) {
  const booking = await bookingService.getAll();
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

export default {
  createBooking,
  getAllBooking,
  getBookingById
};
