import { z } from 'zod';
import moment from 'moment';

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    email: z
      .string()
      .min(1, { message: 'Email must be greater than 1 characters!' })
      .email('This is not a valid email.'),
    password: z
      .string({ description: 'Password is required' })
      .refine((value) => value === '' || value.length >= 8, {
        message: 'Password must be greater than 8 characters!'
      })
      .optional(),
    gender: z
      .string()
      .min(1, { message: 'Gender must be greater than 1 characters!' })
      .refine(
        (value) =>
          value === '' || 'Other' || value === 'Male' || value === 'Female',
        {
          message: 'Gender must be Male/Female/Other!'
        }
      )
      .optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z
      .string()
      .refine(
        (value) => value === '' || (value.length > 1 && value.length <= 10),
        {
          message: 'Phone must be a valid phone'
        }
      )
      .optional(),
    dob: z
      .string()
      .refine(
        (value) =>
          value === '' ||
          (moment(value, 'YYYY-MM-DD').isValid() &&
            moment(value, 'YYYY-MM-DD').isBefore(
              moment(new Date(), 'YYYY-MM-DD')
            )),
        {
          message: 'Date of birth must be a valid date (YYYY-MM-DD)'
        }
      )
      .optional()
  })
});

export type createUserType = z.infer<typeof createUserSchema>;
