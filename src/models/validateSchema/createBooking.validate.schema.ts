import moment from 'moment';
import { z } from 'zod';

const imageSchema = z.object({
  url: z.string()
});

export const updateUserSchema = z.object({
  body: z.object({
    type: z
      .string()
      .min(1, { message: 'Type must be greater than 1 characters!' }),
    paymentType: z
      .string()
      .min(1, { message: 'Payment Type must be greater than 1 characters!' }),
    paymentMethod: z
      .string()
      .min(1, { message: 'Payment Method must be greater than 1 characters!' }),
    totalPrice: z.number(),
    totalHour: z.number(),
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
      )
  })
});

export type updateUserType = z.infer<typeof updateUserSchema>;
