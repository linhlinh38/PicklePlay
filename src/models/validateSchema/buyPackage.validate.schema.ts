import { z } from 'zod';

export const buyPackagePurchaseSchema = z.object({
  body: z.object({
    paymentId: z.string(),
    packageId: z.string(),
    totalCourt: z.number().optional()
  })
});
