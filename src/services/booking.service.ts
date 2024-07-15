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
  PaymentMethodEnum,
  ScheduleStatusEnum,
  ScheduleTypeEnum,
  TransactionTypeEnum
} from '../utils/enums';
import { BaseService } from './base.service';
import { courtService } from './court.service';
import { scheduleService } from './schedule.service';
import scheduleModel from '../models/schedule.model';
import { BookingData, generateQrCode } from './mail.service';
import { ServerError } from '../errors/serverError';
import path from 'path';
import fs from 'fs';
import { ITransaction } from '../interfaces/transaction.interface';
import { transactionService } from './transaction.service';
import courtModel from '../models/court.model';
import { ADMIN_ID } from '../utils/constants';
import { ICourt } from '../interfaces/court.interface';

class BookingService extends BaseService<IBooking> {
  constructor() {
    super(bookingModel);
  }

  async beforeCreate(data: IBooking): Promise<void> {}

  async createBooking(
    booking: IBooking,
    schedule: ISchedule,
    transaction: ITransaction,
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
      const allDates = await this.calculateSchedule(
        booking.startDate,
        booking.endDate
      );

      // for (
      //   let currentDate = moment(booking.startDate, 'YYYY-MM-DD').clone();
      //   currentDate <= moment(booking.endDate);
      //   currentDate.add(1, 'days')
      // ) {
      //   // Check if the current date's weekday matches the permanent slot's preferred day
      //   if (currentDate.day() === moment(schedule.date).day()) {
      //     // 0 = Sunday, 1 = Monday, etc.
      //     allDates.push(new Date(currentDate.toDate()));
      //   }
      // }

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

    const transactionDTO: ITransaction = {
      amount: transaction.amount,
      from: loginUser,
      to: ADMIN_ID,
      type: TransactionTypeEnum.BOOKING,
      payment: transaction.payment,
      paymentMethod: PaymentMethodEnum.LINKED_ACCOUNT
    };
    await transactionService.createTransaction(transactionDTO);

    const { result, base64QR } = await bookingService.updateBookingAfterPayment(
      true,
      booking._id
    );

    return { result, base64QR };
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

  async createCompetionBooking(
    courtArray: string[],
    booking: IBooking,
    schedule: ISchedule,
    transaction: ITransaction,
    loginUser: string
  ) {
    if (
      moment(booking.startDate, 'YYYY-MM-DD').isAfter(
        moment(booking.endDate, 'YYYY-MM-DD')
      )
    ) {
      throw new Error('Start date must be before or equal to end date');
    }

    const court = await courtModel.find({
      _id: { $in: courtArray },
      status: CourtStatusEnum.INUSE
    });

    if (court.length !== courtArray.length)
      throw new NotFoundError('Court not found');

    const checkSchedule = await scheduleModel.find({
      court: { $in: courtArray },
      slots: { $in: schedule.slots },
      date: schedule.date,
      status: {
        $in: [ScheduleStatusEnum.AVAILABLE, ScheduleStatusEnum.PENDING]
      }
    });

    if (checkSchedule.length !== 0) {
      throw new Error('Schedule is already booking');
    }

    const newBooking = {
      type: BookingTypeEnum.COMPETITION_SCHEDULE,
      paymentType: booking.paymentType,
      paymentMethod: booking.paymentMethod,
      totalPrice: booking.totalPrice,
      totalHour: booking.totalHour,
      startDate: booking.startDate,
      endDate: booking.endDate,
      court: courtArray[0],
      status: BookingStatusEnum.PENDING,
      customer: loginUser
    };

    const data = new bookingModel(newBooking);
    const bookingResult = await data.save(newBooking);

    await Promise.all(
      courtArray.map(async (item) => {
        const newSchedule = {
          type: schedule.type,
          slots: schedule.slots,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          date: schedule.date,
          booking: bookingResult._id,
          court: item,
          status: ScheduleStatusEnum.PENDING
        };

        await scheduleService.create(newSchedule);
      })
    );

    const transactionDTO: ITransaction = {
      amount: transaction.amount,
      from: loginUser,
      to: '668a5690a6496e033349398f',
      type: TransactionTypeEnum.BOOKING,
      payment: transaction.payment,
      paymentMethod: PaymentMethodEnum.LINKED_ACCOUNT
    };
    await transactionService.createTransaction(transactionDTO);

    const { result, base64QR } = await bookingService.updateBookingAfterPayment(
      true,
      data._id.toString()
    );

    return { result, base64QR };
  }

  async updateBookingAfterPayment(paymentResult: boolean, bookingId: string) {
    let updateData: Partial<IBooking>;
    let updateSchedule: Partial<ISchedule>;
    const schedules = await scheduleModel.find({ booking: bookingId });

    // const dirname = path.join(__dirname, '..');
    // const relativePath = path.join(dirname, 'image', `${bookingId}.png`);

    // async function createImageFolder() {
    //   try {
    //     fs.mkdirSync(path.dirname(relativePath), { recursive: true });
    //   } catch (err) {
    //     if (err.code !== 'EEXIST') {
    //       console.error('Error creating image folder:', err);
    //     }
    //   }
    // }
    let base64QR;
    if (paymentResult) {
      //await createImageFolder();
      updateData = {
        status: BookingStatusEnum.BOOKED
      };
      updateSchedule = {
        status: ScheduleStatusEnum.AVAILABLE
      };
      const bookingData: BookingData = {
        redirectUrl: `dashboard/check-in/${bookingId}`
      };
      base64QR = await generateQrCode(bookingData);
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

      return { result, base64QR };
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

  async getAllBookingDetailOfCustomer(customerId: string) {
    const booking = await bookingModel.find({ customer: customerId });

    const mapBooking = Promise.all(
      await booking.map(async (item) => {
        const courtSet = new Set<ICourt>();
        if (booking.type === BookingTypeEnum.FLEXIBLE_SCHEDULE) {
          const booking = await bookingModel
            .find({ customer: customerId })
            .populate({
              path: 'court',
              populate: {
                path: 'branch'
              }
            });
          courtSet.add(booking.court as ICourt);
        } else {
          const schedule = await scheduleModel
            .find({ booking: item._id })
            .populate({
              path: 'court',
              populate: {
                path: 'branch'
              }
            });
          if (schedule.length > 0) {
            Promise.all(
              await schedule.map((s: ISchedule) => {
                courtSet.add(s.court as ICourt);
              })
            );
          }
        }

        return {
          _id: item._id,
          type: item.type,
          paymentType: item.paymentType,
          paymentMethod: item.paymentMethod,
          totalPrice: item.totalPrice,
          totalHour: item.totalHour,
          startDate: item.startDate,
          endDate: item.endDate,
          status: item.status,
          customer: item.customer,
          court: Array.from(courtSet)
        };
      })
    );

    return mapBooking;
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

  async calculateSchedule(startDate: string, endDate: string): Promise<any[]> {
    const allDates = [];
    for (
      let currentDate = moment(startDate, 'YYYY-MM-DD').clone();
      currentDate <= moment(endDate);
      currentDate.add(1, 'days')
    ) {
      if (currentDate.day() === moment(startDate).day()) {
        allDates.push(new Date(currentDate.locale('en').format('YYYY-MM-DD')));
      }
    }

    return allDates;
  }
}

export const bookingService = new BookingService();
