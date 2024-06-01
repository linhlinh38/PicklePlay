import { packagePurchase } from './packagePurchase.interface';
import { IPayment } from './payment.interface';

export interface IManager {
  username: string;
  email: string;
  password: string;
  gender: string;
  firstname: string;
  lastname: string;
  phone: string;
  dob: Date;
  payments?: [IPayment];
  expiredDate?: Date;
  maxCourt?: number;
}
