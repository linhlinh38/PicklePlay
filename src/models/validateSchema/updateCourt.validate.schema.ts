import { z } from 'zod';

export const updateCourtObject = z.object({
  name: z
    .string()
    .min(1, { message: 'Name must be greater than 1 characters!' })
    .optional(),
  type: z
    .string()
    .min(1, { message: 'Type must be greater than 1 characters!' })
    .optional(),
  price: z
    .number()
    .gte(1000, 'price must be more than 1.000')
    .lte(100000000, 'price must be less than 100.000.000')
    .optional(),
  description: z
    .string()
    .min(1, { message: 'Description must be greater than 1 characters!' })
    .optional(),
  images: z.array(z.string()).optional().nullable()
});

export const updateCourtSchema = z.object({
  body: updateCourtObject
});
