import { z } from 'zod';
import { regexPhoneNumber } from '../../utils/regex';
import { createCourtObject } from './createCourt.validate.schema';
import { createSlotObject } from './createSlot.validate.schema';

export const createBranchSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Username must be greater than 1 characters!' }),
    address: z.string(),
    licenses: z.array(z.string()).min(1, 'License must have at least 1'),
    images: z.array(z.string()).min(1, 'Image must have at least 1'),
    description: z.string().optional().nullable(),
    availableTime: z.string(),
    phone: z
      .string()
      .min(1, { message: 'Phone must be greater than 1 number!' })
      .max(10, { message: 'Phone must be less than 10 number!' })
      .regex(regexPhoneNumber, { message: 'Phone must be a valid phone' }),
    courts: z.array(createCourtObject).min(1, 'Courts must have at least 1'),
    slots: z.array(createSlotObject).min(1, 'Slots must have at least 1')
  })
});
