import { IUser } from '../interfaces/user.interface';
import operatorModel from '../models/operator.model';
import { BaseService } from './base.service';

class OperatorService extends BaseService<IUser> {
  constructor() {
    super(operatorModel);
  }
}

export const operatorService = new OperatorService();
