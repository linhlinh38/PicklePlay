import { z } from 'zod';

export const paymentSchema = z.object({
  body: z.object({
    accountNumber: z.string().regex(/^\d{16}$/, 'Only accept 16 digits'),
    accountName: z.string(),
    accountBank: z.string(),
    expDate: z.string().optional()
  })
});
