import { IUser } from '../interfaces/user.interface';
import customerModel from '../models/customer.model';
import { BaseService } from './base.service';

class CustomerService extends BaseService<IUser> {
  constructor() {
    super(customerModel);
  }
}

export const customerService = new CustomerService();
