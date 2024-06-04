import { ICourt } from '../interfaces/court.interface';
import courtModel from '../models/court.model';
import { CourtStatusEnum } from '../utils/enums';
import { BaseService } from './base.service';

class CourtService extends BaseService<ICourt> {
  constructor() {
    super(courtModel);
  }

  async beforeCreate(data: ICourt): Promise<void> {
    // check branch exist and in Active status or not
    // check how many court can create in this branch
    // If branch is in Pending status (request create new branch) then the court create status is also in pending status
    // If branch is in Active status then the court create status is Inuse
  }
}

export const courtService = new CourtService();
