import moment from 'moment';
import { z } from 'zod';
//import { createScheduleSchema } from './createSchedule.validate.schema';

export const createScheduleSchema = z.object({
  type: z
    .string()
    .min(1, { message: 'Type must be greater than 1 characters!' }),
  startTime: z
    .string()
    .refine((value) => moment(value, 'HH:mm', true).isValid(), {
      message: 'Start time must be a valid time (HH:mm)'
    }),
  endTime: z
    .string()
    .refine((value) => moment(value, 'HH:mm', true).isValid(), {
      message: 'End time must be a valid time (HH:mm)'
    }),
  date: z
    .string()
    .refine(
      (value) =>
        moment(value, 'YYYY-MM-DD').isValid() &&
        moment(value, 'YYYY-MM-DD').fromNow(),
      {
        message: 'Date must be a valid date (YYYY-MM-DD)'
      }
    )
    .optional(),
  slots: z.array(z.string()).min(1, 'Slots must have at least 1'),
  court: z.string()
});

export const createTransactionSchema = z.object({
  amount: z.number()
});

export const createBookingSchema = z.object({
  body: z.object({
    booking: z.object({
      type: z
        .string()
        .min(1, { message: 'Type must be greater than 1 characters!' }),
      paymentType: z
        .string()
        .min(1, { message: 'Payment Type must be greater than 1 characters!' }),
      paymentMethod: z.string().min(1, {
        message: 'Payment Method must be greater than 1 characters!'
      }),
      totalPrice: z.number(),
      totalHour: z.number().optional(),
      startDate: z
        .string()
        .refine(
          (value) =>
            moment(value, 'YYYY-MM-DD').isValid() &&
            moment(value, 'YYYY-MM-DD').fromNow(),
          {
            message: 'Start date must be a valid date (YYYY-MM-DD)'
          }
        ),
      endDate: z
        .string()
        .refine(
          (value) =>
            moment(value, 'YYYY-MM-DD').isValid() &&
            moment(value, 'YYYY-MM-DD').fromNow(),
          {
            message: 'End date must be a valid date (YYYY-MM-DD)'
          }
        ),
      court: z.string()
    }),
    schedule: createScheduleSchema.optional(),
    transaction: createTransactionSchema.optional()
  })
});

export type createBookingType = z.infer<typeof createBookingSchema>;
