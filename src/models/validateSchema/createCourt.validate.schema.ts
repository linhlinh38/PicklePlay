import { string, z } from 'zod';

export const createCourtSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name must be greater than 1 characters!' }),
    type: z
      .string()
      .min(1, { message: 'Type must be greater than 1 characters!' }),
    price: z
      .number()
      .gte(1000, 'price must be more than 1.000')
      .lte(100000000, 'price must be less than 100.000.000'),
    images: z.array(z.string()),
    description: z
      .string()
      .min(1, { message: 'Description must be greater than 1 characters!' })
      .optional()
  })
});

export type updateUserType = z.infer<typeof createCourtSchema>;
