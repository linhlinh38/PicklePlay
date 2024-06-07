import { InsertManyResult } from 'mongoose';
import { NotFoundError } from '../errors/notFound';
import { ICourt } from '../interfaces/court.interface';
import courtModel from '../models/court.model';
import { BranchStatusEnum, CourtStatusEnum } from '../utils/enums';
import { filesUploadProcessing } from '../utils/fileUploadProcessing';
import { BaseService } from './base.service';
import { branchService } from './branch.service';

class CourtService extends BaseService<ICourt> {
  constructor() {
    super(courtModel);
  }

  async beforeCreate(data: ICourt): Promise<void> {
    // check branch exist and in Active status or not
    const branch = await branchService.getById(data.branch as string);
    if (!branch) {
      throw new NotFoundError('Branch not found');
    }
    // If branch is in Pending status (request create new branch) then the court create status is also in pending status
    if (branch.status === BranchStatusEnum.PENDING)
      data.status = CourtStatusEnum.PENDING;
    // If branch is in Active status then the court create status is Inuse
    if (branch.status === BranchStatusEnum.ACTIVE)
      data.status = CourtStatusEnum.INUSE;
  }

  async createManyCourts(courts: ICourt[]): Promise<ICourt[]> {
    try {
      const result: ICourt[] = await courtModel.insertMany(courts);

      return result;
    } catch (error) {
      console.error('Error creating courts:', error);
      throw error; // Re-throw the error for handling in your route or calling code
    }
  }
}

export const courtService = new CourtService();
