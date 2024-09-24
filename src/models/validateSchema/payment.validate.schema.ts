import { z } from 'zod';

export const paymentSchema = z.object({
  body: z.object({
    accountNumber: z.string(),
    accountName: z.string(),
    accountBank: z.string(),
    expDate: z.string().optional()
  })
});
