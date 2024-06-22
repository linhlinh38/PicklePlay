import { ISchedule } from '../interfaces/schedule.interface';
import { NextFunction, Request, Response } from 'express';
import { scheduleService } from '../services/schedule.service';
import { AuthRequest } from '../middlewares/authentication';
import { IBooking } from '../interfaces/booking.interface';
import { bookingService } from '../services/booking.service';
import {
  BookingTypeEnum,
  RoleEnum,
  ScheduleStatusEnum,
  ScheduleTypeEnum
} from '../utils/enums';
import { BadRequestError } from '../errors/badRequestError';
import { userService } from '../services/user.service';
import { NotFoundError } from '../errors/notFound';

async function getScheduleByCourt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const key: Partial<ISchedule> = {
      court: req.params.court as string,
      status: ScheduleStatusEnum.AVAILABLE
    };
    const schedule = await scheduleService.search(key);
    return res.status(200).json({ scheduleList: schedule });
  } catch (error) {
    next(error);
  }
}

async function getScheduleByBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const key: Partial<ISchedule> = {
      booking: req.params.booking as string
    };
    const schedule = await scheduleService.search(key);
    return res.status(200).json({ scheduleList: schedule });
  } catch (error) {
    next(error);
  }
}

async function getScheduleOfCustomer(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const searchBooking: Partial<IBooking> = {
      customer: req.loginUser
    };
    console.log('bookings', req.loginUser);
    const bookings = await bookingService.search(searchBooking);
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: 'No bookings found for this customer' });
    }

    const bookingIds = bookings.map((booking) => booking._id);
    const searchSchedule: Partial<ISchedule> = {
      booking: { $in: bookingIds } as any
    };

    const schedules = await scheduleService.search(searchSchedule);
    const filterSchedules: Record<string, ISchedule[]> = {};
    schedules.forEach((schedule) => {
      const status = schedule.status;
      if (!filterSchedules[status]) {
        filterSchedules[status] = [];
      }
      filterSchedules[status].push(schedule);
    });
    return res.status(200).json({ scheduleList: filterSchedules });
  } catch (error) {
    next(error);
  }
}

async function createSchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const newSchedule: ISchedule = {
      type: req.body.type,
      slots: req.body.slots,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      date: req.body.date,
      booking: req.body.booking,
      court: req.body.court,
      status: ScheduleStatusEnum.AVAILABLE
    };

    let booking;
    if (newSchedule.booking) {
      booking = await bookingService.getById(newSchedule.booking as string);
      const user = await userService.getById(req.loginUser);

      if (
        booking.type !== BookingTypeEnum.FLEXIBLE_SCHEDULE &&
        user.role === RoleEnum.CUSTOMER
      ) {
        throw new BadRequestError(
          'Create schedule is for FLEXIBLE_SCHEDULE or staff and manager'
        );
      }
    }
    await scheduleService.createSchedule(newSchedule);
    return res.status(201).json({ message: 'Created Schedule Successfully' });
  } catch (error) {
    next(error);
  }
}

async function updateSchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const updateSchedule: Partial<ISchedule> = {
      status: ScheduleStatusEnum.DONE
    };
    const schedule = await scheduleService.getById(req.params.id);

    if (!schedule) {
      throw new NotFoundError('Schedule not found');
    }

    await scheduleService.update(req.params.id, updateSchedule);
    return res.status(201).json({ message: 'Update Schedule Successfully' });
  } catch (error) {
    next(error);
  }
}

async function cancelSchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const schedule = await scheduleService.getById(req.params.id);

    if (!schedule) {
      throw new NotFoundError('Schedule not found');
    }

    await scheduleService.delete(req.params.id);
    return res.status(201).json({ message: 'Delete Schedule Successfully' });
  } catch (error) {
    next(error);
  }
}

export default {
  getScheduleByBooking,
  getScheduleByCourt,
  getScheduleOfCustomer,
  createSchedule,
  updateSchedule,
  cancelSchedule
};