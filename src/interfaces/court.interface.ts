import { IManager } from './manager.interface';

export interface ICourt {
  _id?: string;
  name: string;
  type: string;
  price: number;
  images?: Express.Multer.File[] | string[];
  description: string;
  status: string;
  branch?: string | IManager;
}
