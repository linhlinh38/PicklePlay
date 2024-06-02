import { IPackageCourt } from './packageCourt.interface';
import { IManager } from './manager.interface';

export interface IPackagePurchase {
  totalPrice: number;
  totalCourt: number;
  startDate: Date;
  endDate: Date;
  manager?: IManager;
  packageCourt?: IPackageCourt;
}
