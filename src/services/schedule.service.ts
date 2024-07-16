import moment from 'moment';
import { BadRequestError } from '../errors/badRequestError';
import { IBooking } from '../interfaces/booking.interface';
import { ISchedule } from '../interfaces/schedule.interface';
import scheduleModel from '../models/schedule.model';
import { BookingTypeEnum, ScheduleStatusEnum } from '../utils/enums';
import { BaseService } from './base.service';
import { bookingService } from './booking.service';
import { userService } from './user.service';
import slotModel from '../models/slot.model';

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

  async getScheduleWithPopulateInfo(
    key: Partial<ISchedule>
  ): Promise<ISchedule[]> {
    const schedule = await scheduleModel
      .find(key)
      .populate({
        path: 'booking',
        populate: {
          path: 'customer'
        }
      })
      .populate({
        path: 'court',
        populate: {
          path: 'branch'
        }
      });
    return schedule;
  }

  async getScheduleCourtInfo(key: Partial<ISchedule>): Promise<ISchedule[]> {
    const schedule = await scheduleModel.find(key).populate({
      path: 'court',
      populate: {
        path: 'branch'
      }
    });
    return schedule;
  }

  async beforeCreate(data: ISchedule): Promise<void> {
    const checkSchedule = await scheduleModel.find({
      court: data.court,
      slots: { $in: data.slots },
      date: data.date,
      status: {
        $in: [ScheduleStatusEnum.AVAILABLE, ScheduleStatusEnum.PENDING]
      }
    });

    if (
      moment(data.date, 'YYYY-MM-DD').isSame(
        moment(new Date(), 'YYYY-MM-DD')
      ) &&
      moment(new Date(), 'HH:mm').isAfter(moment(data.startTime, 'HH:mm'))
    ) {
      throw new BadRequestError(
        'Schedule cannot create due to unvalid start time'
      );
    }

    if (checkSchedule.length !== 0) {
      throw new BadRequestError('Schedule is already booking');
    }
    let booking;
    if (data.booking) {
      booking = await bookingService.getById(data.booking as string);
      if (booking.type === BookingTypeEnum.FLEXIBLE_SCHEDULE) {
        const slots = await slotModel.find({ _id: { $in: data.slots } });
        let bookingHour = 0;
        await slots.map(async (slot) => {
          const calulateDuration = await this.getSlotDuration(
            slot.startTime,
            slot.endTime
          );
          bookingHour += calulateDuration;
        });

        if (
          moment(booking.startDate, 'YYYY-MM-DD').isAfter(
            moment(data.date, 'YYYY-MM-DD')
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
  }

  async createSchedule(data: ISchedule): Promise<ISchedule> {
    await this.beforeCreate(data);
    const newSchedule = new this.model(data);
    await newSchedule.save();
    let booking;
    if (newSchedule.booking) {
      booking = await bookingService.getById(newSchedule.booking as string);
      if (booking.type === BookingTypeEnum.FLEXIBLE_SCHEDULE) {
        const slots = await slotModel.find({ _id: { $in: data.slots } });
        let bookingHour = 0;
        await slots.map(async (slot) => {
          const calulateDuration = await this.getSlotDuration(
            slot.startTime,
            slot.endTime
          );
          bookingHour += calulateDuration;
        });

        await bookingService.updateTotalHours(
          data.booking as string,
          bookingHour
        );
      }
    }

    return newSchedule;
  }
}

export const scheduleService = new ScheduleService();
