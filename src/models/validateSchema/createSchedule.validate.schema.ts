import moment from 'moment';
import { z } from 'zod';

export const createScheduleSchema = z.object({
  body: z.object({
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
      ),
    slots: z.array(z.string()).min(1, 'Slots must have at least 1'),
    court: z.string()
  })
});

export type createScheduleType = z.infer<typeof createScheduleSchema>;
