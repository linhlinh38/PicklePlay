import moment from 'moment';
import { BadRequestError } from '../errors/badRequestError';
import { NotFoundError } from '../errors/notFound';
import { IBooking } from '../interfaces/booking.interface';
import { ICourt } from '../interfaces/court.interface';
import { ISchedule } from '../interfaces/schedule.interface';
import bookingModel from '../models/booking.model';
import {
  BookingStatusEnum,
  BookingTypeEnum,
  ScheduleStatusEnum
} from '../utils/enums';
import { BaseService } from './base.service';
import { courtService } from './court.service';
import { scheduleService } from './schedule.service';

class BookingService extends BaseService<IBooking> {
  constructor() {
    super(bookingModel);
  }

  async beforeCreate(data: IBooking): Promise<void> {}

  async createBooking(booking: IBooking, schedule: ISchedule) {
    if (
      moment(booking.startDate, 'YYYY-MM-DD').isAfter(
        moment(booking.endDate, 'YYYY-MM-DD')
      )
    ) {
      throw new Error('Start date must be before or equal to end date');
    }

    const court = await courtService.getById(schedule.court as string);
    if (!court) throw new NotFoundError('Court not found');

    const checkSchedule = await scheduleService.search({
      court: schedule.court,
      slot: schedule.slot,
      date: schedule.date
    });

    const checkResult = checkSchedule.filter(
      (schedule) => schedule.status === ScheduleStatusEnum.AVAILABLE
    );
    if (checkResult.length !== 0) {
      throw new BadRequestError('Schedule is already booking');
    }

    const newBooking = {
      type: booking.type,
      paymentType: booking.paymentType,
      paymentMethod: booking.paymentMethod,
      totalPrice: booking.totalPrice,
      totalHour: booking.totalHour,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: BookingStatusEnum.PENDING,
      customer: booking.customer
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
          type: ScheduleStatusEnum.AVAILABLE,
          slot: schedule.slot,
          date,
          booking: booking._id,
          court: schedule.court,
          status: ScheduleStatusEnum.AVAILABLE
        };
        await scheduleService.create(newSchedule);
      });

      await Promise.all(promises);
    }
    if (booking.type === BookingTypeEnum.SINGLE_SCHEDULE) {
      const newSchedule = {
        type: schedule.type,
        slot: schedule.slot,
        date: schedule.date,
        booking: booking._id,
        court: schedule.court,
        status: ScheduleStatusEnum.AVAILABLE
      };

      await scheduleService.create(newSchedule);
    }
  }
}

export const bookingService = new BookingService();
