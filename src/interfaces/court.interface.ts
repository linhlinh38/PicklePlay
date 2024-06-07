import { IManager } from './manager.interface';

export interface ICourt {
  name: string;
  type: string;
  price: number;
  images?: Express.Multer.File[] | string[];
  description: string;
  status: string;
  branch: string | IManager;
}
