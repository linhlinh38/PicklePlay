import moment from 'moment';
import { BadRequestError } from '../errors/badRequestError';
import { NotFoundError } from '../errors/notFound';
import { IBooking } from '../interfaces/booking.interface';
import { ISchedule } from '../interfaces/schedule.interface';
import bookingModel from '../models/booking.model';

import {
  BookingStatusEnum,
  BookingTypeEnum,
  CourtStatusEnum,
  RoleEnum,
  ScheduleStatusEnum,
  ScheduleTypeEnum
} from '../utils/enums';
import { BaseService } from './base.service';
import { courtService } from './court.service';
import { scheduleService } from './schedule.service';
import scheduleModel from '../models/schedule.model';
import { BookingData, generateQrCode } from './mail.service';
import { ServerError } from '../errors/serverError';
import path from 'path';

class BookingService extends BaseService<IBooking> {
  constructor() {
    super(bookingModel);
  }

  async beforeCreate(data: IBooking): Promise<void> {}

  async createBooking(
    booking: IBooking,
    schedule: ISchedule,
    loginUser: string
  ) {
    if (
      moment(booking.startDate, 'YYYY-MM-DD').isAfter(
        moment(booking.endDate, 'YYYY-MM-DD')
      )
    ) {
      throw new Error('Start date must be before or equal to end date');
    }

    const court = await courtService.getById(booking.court as string);
    if (!court) throw new NotFoundError('Court not found');
    if (court.status === CourtStatusEnum.TERMINATION)
      throw new BadRequestError('Court is Termination');

    if (booking.type !== BookingTypeEnum.FLEXIBLE_SCHEDULE) {
      const checkSchedule = await scheduleModel.find({
        court: schedule.court,
        slots: { $in: schedule.slots },
        date: schedule.date,
        status: {
          $in: [ScheduleStatusEnum.AVAILABLE, ScheduleStatusEnum.PENDING]
        }
      });

      if (checkSchedule.length !== 0) {
        throw new BadRequestError('Schedule is already booking');
      }
    }

    const newBooking = {
      type: booking.type,
      paymentType: booking.paymentType,
      paymentMethod: booking.paymentMethod,
      totalPrice: booking.totalPrice,
      totalHour: booking.totalHour,
      startDate: booking.startDate,
      endDate: booking.endDate,
      court: booking.court,
      status: BookingStatusEnum.PENDING,
      customer: loginUser
    };

    booking = await bookingModel.create(newBooking);

    if (booking.type === BookingTypeEnum.PERMANENT_SCHEDULE) {
      const allDates = [];

      for (
        let currentDate = moment(booking.startDate, 'YYYY-MM-DD').clone();
        currentDate <= moment(booking.endDate);
        currentDate.add(1, 'days')
      ) {
        // Check if the current date's weekday matches the permanent slot's preferred day
        if (currentDate.day() === moment(schedule.date).day()) {
          // 0 = Sunday, 1 = Monday, etc.
          allDates.push(new Date(currentDate.toDate()));
        }
      }

      const promises = allDates.map(async (date) => {
        const newSchedule = {
          type: ScheduleTypeEnum.BOOKING,
          slots: schedule.slots,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          date,
          booking: booking._id,
          court: schedule.court,
          status: ScheduleStatusEnum.PENDING
        };
        await scheduleService.create(newSchedule);
      });

      await Promise.all(promises);
    }
    if (booking.type === BookingTypeEnum.SINGLE_SCHEDULE) {
      const newSchedule = {
        type: schedule.type,
        slots: schedule.slots,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        date: schedule.date,
        booking: booking._id,
        court: schedule.court,
        status: ScheduleStatusEnum.PENDING
      };

      await scheduleService.create(newSchedule);
    }
    return true;
  }

  async updateTotalHours(bookingId: string, duration: number) {
    const booking = await this.getById(bookingId);
    const updateData: Partial<IBooking> = {
      totalHour: booking.totalHour - duration
    };
    try {
      await this.update(bookingId, updateData);
      return true;
    } catch (error) {
      throw new ServerError(error);
    }
  }

  async updateBookingAfterPayment(paymentResult: boolean, bookingId: string) {
    let updateData: Partial<IBooking>;
    let updateSchedule: Partial<ISchedule>;
    const schedules = await scheduleModel.find({ booking: bookingId });
    const relativePath = path.join(__dirname, 'image', `${bookingId}.png`);
    if (paymentResult) {
      updateData = {
        status: BookingStatusEnum.BOOKED
      };
      updateSchedule = {
        status: ScheduleStatusEnum.AVAILABLE
      };
      const bookingData: BookingData = {
        redirectUrl: `/checkin/${bookingId}`
      };
      await generateQrCode(bookingData, relativePath);
    } else {
      updateData = {
        status: BookingStatusEnum.CANCELLED
      };
    }
    try {
      const result = await this.update(bookingId, updateData);
      if (schedules.length > 0) {
        if (result.status === BookingStatusEnum.BOOKED) {
          schedules.map(async (schedule) => {
            return await scheduleService.update(schedule._id, updateSchedule);
          });
        }
        if (result.status === BookingStatusEnum.CANCELLED) {
          schedules.map(async (schedule) => {
            return await scheduleService.delete(schedule._id);
          });
        }
      }

      return { result, relativePath };
    } catch (error) {
      throw new ServerError(error);
    }
  }

  async getBookingByCustomer(customerId: string) {
    const booking = await bookingModel.find({ customer: customerId }).populate({
      path: 'court',
      populate: {
        path: 'branch'
      }
    });
    return booking;
  }

  async getBookingByStatus(customerId: string, status: string) {
    const booking = await bookingModel
      .find({ customer: customerId, status: status })
      .populate({
        path: 'court',
        populate: {
          path: 'branch'
        }
      });
    return booking;
  }
}

export const bookingService = new BookingService();
