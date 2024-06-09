import { z } from 'zod';
import { WeekDayEnum } from '../../utils/enums';
import { timeFormat } from '../../utils/regex';

export const createSlotObject = z.object({
  name: z.string().optional().nullable(),
  weekDay: z.nativeEnum(WeekDayEnum, {
    errorMap: () => ({
      message: 'Invalid week day! Must be a valid day of the week.'
    })
  }),
  startTime: z
    .string()
    .regex(timeFormat, { message: 'Invalid time format! Use HH:MM.' }),
  endTime: z
    .string()
    .regex(timeFormat, { message: 'Invalid time format! Use HH:MM.' }),
  surcharge: z.number().gte(-1)
});

export const createSlotSchema = z.object({
  body: createSlotObject
});
