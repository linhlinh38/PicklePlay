import moment from 'moment';
import { BadRequestError } from '../errors/badRequestError';
import { IBooking } from '../interfaces/booking.interface';
import { ISchedule } from '../interfaces/schedule.interface';
import scheduleModel from '../models/schedule.model';
import { BookingTypeEnum, ScheduleStatusEnum } from '../utils/enums';
import { BaseService } from './base.service';
import { bookingService } from './booking.service';
import { userService } from './user.service';

class ScheduleService extends BaseService<ISchedule> {
  constructor() {
    super(scheduleModel);
  }

  async getSlotDuration(startslot: string, endslot: string): Promise<number> {
    const startTime = moment(startslot, 'HH:mm');
    const endTime = moment(endslot, 'HH:mm');
    const duration = moment.duration(endTime.diff(startTime));
    const slotDuration = duration.asHours();
    return slotDuration;
  }

  async beforeCreate(data: ISchedule): Promise<void> {
    const checkSchedule = await scheduleService.search({
      court: data.court,
      slot: data.slot,
      date: data.date,
      status: ScheduleStatusEnum.AVAILABLE
    });

    if (checkSchedule.length !== 0) {
      throw new BadRequestError('Schedule is already booking');
    }
    const booking = await bookingService.getById(data.booking as string);
    const startslot = '07:00';
    const endslot = '09:00';

    const bookingHour = await this.getSlotDuration(startslot, endslot);

    if (booking.type === BookingTypeEnum.FLEXIBLE_SCHEDULE) {
      if (
        moment(booking.startDate, 'YYYY-MM-DD').isAfter(
          moment(new Date(), 'YYYY-MM-DD')
        )
      ) {
        throw new BadRequestError(
          `Schedule cannot create due to Booking start date is ${booking.startDate}`
        );
      }
      if (bookingHour > booking.totalHour) {
        throw new BadRequestError(
          `Schedule cannot create due to Booking Flexible only remain ${booking.totalHour} Hour`
        );
      }
    }
  }

  async createSchedule(data: ISchedule): Promise<ISchedule> {
    await this.beforeCreate(data);
    const newSchedule = new this.model(data);
    await newSchedule.save();

    const booking = await bookingService.getById(data.booking as string);
    const startslot = '07:00';
    const endslot = '09:00';

    if (booking.type === BookingTypeEnum.FLEXIBLE_SCHEDULE) {
      const bookingHour = await this.getSlotDuration(startslot, endslot);
      await bookingService.updateTotalHours(
        data.booking as string,
        bookingHour
      );
    }

    return newSchedule;
  }
}

export const scheduleService = new ScheduleService();
