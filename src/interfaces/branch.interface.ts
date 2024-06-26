import { ICourt } from './court.interface';
import { IManager } from './manager.interface';
import { ISlot } from './slot.interface';

export interface IBranch {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  images?: Express.Multer.File[] | string[];
  licenses: string[];
  description: string;
  availableTime: string;
  status?: string;
  manager?: string | IManager;
  courts: ICourt[];
  slots: ISlot[];
}
