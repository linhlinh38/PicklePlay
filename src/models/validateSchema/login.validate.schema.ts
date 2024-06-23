import { z } from 'zod';
import { regexPhoneNumber } from '../../utils/regex';
import moment from 'moment';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: 'Email must be greater than 1 characters!' })
      .email('This is not a valid email.'),
    password: z.string({ description: 'Password is required' }).optional()
  })
});

export type loginType = z.infer<typeof loginSchema>;
