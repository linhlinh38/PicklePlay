import { IPayment } from './payment.interface';

export interface IManager {
  _id?: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: Date;
  payments?: [IPayment];
  expiredDate?: Date;
  maxCourt?: number;
  role: string;
  status: string;
}
