import { ICourt } from './court.interface';
import { IManager } from './manager.interface';

export interface IBranch {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  images?: Express.Multer.File[] | string[];
  license: string[];
  description: string;
  availableTime: string;
  status?: string;
  manager?: string | IManager;
  courts: ICourt[];
}
