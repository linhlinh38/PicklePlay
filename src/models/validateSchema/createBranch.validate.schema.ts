import { z } from 'zod';
import { regexPhoneNumber } from '../../utils/regex';

export const createBranchSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Username must be greater than 1 characters!' }),
    address: z.string(),
    license: z.array(z.string()).min(1, 'License must have at least 1'),
    totalCourt: z.number().min(1),
    slotDuration: z.number(),
    description: z.string().optional().nullable(),
    availableTimes: z.array(z.string()).min(1, 'License must have at least 1'),
    phone: z
      .string()
      .min(1, { message: 'Phone must be greater than 1 number!' })
      .max(10, { message: 'Phone must be less than 10 number!' })
      .regex(regexPhoneNumber, { message: 'Phone must be a valid phone' })
  })
});
