import { BaseService } from './base.service';
import packageCourtModel from '../models/packageCourt.model';
import { IPackageCourt } from '../interfaces/packageCourt.interface';
import { IBuyPackage } from '../interfaces/buyPackage.interface';
import { IPackagePurchase } from '../interfaces/packagePurchase.interface';
import { IManager } from '../interfaces/manager.interface';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import { duration } from 'moment';
import packagePurchaseModel from '../models/packagePurchase.model';
import managerModel from '../models/manager.model';

class PackageCourtService extends BaseService<IPackageCourt> {
  constructor() {
    super(packageCourtModel);
  }

  async buyPackageCourt(buyPackageDTO: IBuyPackage) {
    const packageCourt: IPackageCourt = await packageCourtService.getById(
      buyPackageDTO.packageId
    );
    if (!packageCourt) throw new NotFoundError('Package not found');
    const manager = await managerService.getById(buyPackageDTO.managerId);

    if (!manager) throw new NotFoundError('Manager not found');
    const startDateOfPackagePurchase = new Date(manager.expiredDate);
    startDateOfPackagePurchase.setDate(
      startDateOfPackagePurchase.getDate() + 1
    );
    const endDateOfPackagePurchase = new Date(startDateOfPackagePurchase);
    endDateOfPackagePurchase.setMonth(
      endDateOfPackagePurchase.getMonth() +
        (packageCourt.duration || buyPackageDTO.duration)
    );

    const createdPackagePurchase = {
      totalPrice:
        packageCourt.totalPrice ||
        packageCourt.priceEachCourt *
          buyPackageDTO.totalCourt *
          buyPackageDTO.duration,
      totalCourt: packageCourt.maxCourt || buyPackageDTO.totalCourt,
      startDate: startDateOfPackagePurchase,
      endDate: endDateOfPackagePurchase,
      manager: buyPackageDTO.managerId,
      packageCourt: buyPackageDTO.packageId
    };
    await packagePurchaseModel.create(createdPackagePurchase);

    manager.expiredDate = endDateOfPackagePurchase;
    await manager.save();
  }
}

export const packageCourtService = new PackageCourtService();
