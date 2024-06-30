import { z } from 'zod';

export const createPackageCourtSchema = z.object({
  body: z.object({
    name: z.string(),
    totalPrice: z.number().nullable().optional(),
    priceEachCourt: z.number().nullable().optional(),
    maxCourt: z.number().int().min(1).optional().nullable(),
    duration: z.number().int().min(1).max(12).optional().nullable(),
    description: z.string().optional(),
    type: z
      .string()
      .refine((value) => value === 'Custom' || value === 'Standard', {
        message: 'Type only accepts Custom/Standard'
      })
  })
});
