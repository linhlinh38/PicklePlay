import moment from 'moment';
import { z } from 'zod';

const regexPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

export const updateUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, { message: 'Username must be greater than 1 characters!' })
      .optional(),
    email: z
      .string()
      .min(1, { message: 'Email must be greater than 1 characters!' })
      .email('This is not a valid email.')
      .optional(),
    password: z
      .string({ description: 'Password is required' })
      .min(8, { message: 'Password must be greater than 8 characters!' })
      .optional(),
    gender: z
      .string()
      .min(1, { message: 'Gender must be greater than 1 characters!' })
      .refine(
        (value) => value === 'Other' || value === 'Male' || value === 'Female',
        {
          message: 'Gender must be Male/Female/Other!'
        }
      )
      .optional(),
    firstName: z
      .string()
      .min(1, { message: 'First name must be greater than 1 characters!' })
      .optional(),
    lastName: z
      .string()
      .min(1, { message: 'Last Name must be greater than 1 characters!' })
      .optional(),
    phone: z
      .string()
      .min(1, { message: 'Phone must be greater than 1 number!' })
      .max(10, { message: 'Phone must be less than 10 number!' })
      .regex(regexPhoneNumber, { message: 'Phone must be a valid phone' })
      .optional(),
    dob: z
      .string()
      .refine(
        (value) =>
          moment(value, 'YYYY-MM-DD').isValid() &&
          moment(value, 'YYYY-MM-DD').isBefore(
            moment(new Date(), 'YYYY-MM-DD')
          ),
        {
          message: 'Date of birth must be a valid date (YYYY-MM-DD)'
        }
      )
      .optional()
  })
});

export type updateUserType = z.infer<typeof updateUserSchema>;
