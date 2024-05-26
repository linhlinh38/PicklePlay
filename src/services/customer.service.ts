import { IUser } from '../interfaces/user.interface';
import customerModel from '../models/customer.model';
import { BaseService } from './base.service';
const bcrypt = require('bcrypt');

class CustomerService extends BaseService<IUser> {
  constructor() {
    super(customerModel);
  }

  encryptedPassword = function (password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

}

export const customerService = new CustomerService();
