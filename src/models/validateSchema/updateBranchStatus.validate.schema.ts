import { z } from 'zod';
import { BranchStatusEnum } from '../../utils/enums';

export const updateBranchStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BranchStatusEnum, {
      errorMap: () => ({
        message: 'Invalid status'
      })
    }),
    branchId: z.string()
  })
});
