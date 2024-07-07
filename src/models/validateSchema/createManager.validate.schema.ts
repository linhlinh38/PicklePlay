import { z } from 'zod';
import { regexPhoneNumber } from '../../utils/regex';

const paymentSchema = z.object({
  accountNumber: z.string().min(1, 'Account number is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountBank: z.string(),
  expDate: z.date().optional()
});

export const createManagerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, { message: 'Username must be greater than 1 characters!' })
      .optional(),
    email: z
      .string()
      .min(1, { message: 'Email must be greater than 1 characters!' })
      .email('This is not a valid email.'),
    password: z
      .string({ description: 'Password is required' })
      .min(8, { message: 'Password must be greater than 8 characters!' }),
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
      .transform((str) => new Date(str))
      .refine((dob) => dob < new Date(), {
        message: 'Date of birth must be in the past'
      })
      .optional(),
    payments: z.array(paymentSchema).optional()
  })
});
