import { BaseService } from './base.service';
import packageCourtModel from '../models/packageCourt.model';
import { IPackageCourt } from '../interfaces/packageCourt.interface';
import { IBuyPackage } from '../interfaces/buyPackage.interface';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import packagePurchaseModel from '../models/packagePurchase.model';
import { PackageCourtTypeEnum } from '../utils/enums';
import { BadRequestError } from '../errors/badRequestError';

class PackageCourtService extends BaseService<IPackageCourt> {
  constructor() {
    super(packageCourtModel);
  }

  async beforeCreate(data: IPackageCourt): Promise<void> {
    if (data.type == PackageCourtTypeEnum.CUSTOM) {
      const existPackageCustom = await this.model.findOne({
        type: data.type
      });
      if (existPackageCustom)
        throw new BadRequestError('Already have custom package');

      if (data.duration)
        throw new BadRequestError('Custom package can not have Duration info');
      if (data.maxCourt)
        throw new BadRequestError('Custom package can not have Max Court info');
      if (data.totalPrice)
        throw new BadRequestError(
          'Custom package can not have Total Price info'
        );
    }
  }

  async buyPackageCourt(buyPackageDTO: IBuyPackage) {
    const packageCourt: IPackageCourt = await packageCourtService.getById(
      buyPackageDTO.packageId
    );
    if (!packageCourt) throw new NotFoundError('Package not found');
    const manager = await managerService.getById(buyPackageDTO.managerId);
    if (!manager) throw new NotFoundError('Manager not found');

    if (packageCourt.type == PackageCourtTypeEnum.CUSTOM) {
      if (packageCourt.maxCourt > 20)
        throw new BadRequestError(
          'Custom package can only be bought for maximum 20 courts'
        );
    }

    const currentDate = new Date();
    if (manager.expiredDate && manager.expiredDate > currentDate) {
      throw new BadRequestError(
        'You cannot purchase a new court package as your current package is still active'
      );
    }
    //     const currentPackagePurchase = await packagePurchaseModel.findOne({
    //       manager: buyPackageDTO.managerId,
    //       endDate: { $gte: currentDate }
    //     });

    // if (currentPackagePurchase) {
    //   const timeLeft = Math.ceil(
    //     currentPackagePurchase.endDate.getTime() - currentDate.getTime()
    //   );
    //   if (timeLeft > 0) {
    //     throw new BadRequestError(
    //       'You cannot purchase a new court package as your current package is still active'
    //     );
    //   }
    // }

    const duration = packageCourt.duration || 1;
    const totalCourt = packageCourt.maxCourt || buyPackageDTO.totalCourt;
    const totalPrice =
      packageCourt.totalPrice ||
      packageCourt.priceEachCourt * buyPackageDTO.totalCourt;

    const startDateOfPackagePurchase = new Date(
      manager.expiredDate || new Date()
    );
    startDateOfPackagePurchase.setDate(
      startDateOfPackagePurchase.getDate() + 1
    );
    const endDateOfPackagePurchase = new Date(startDateOfPackagePurchase);
    endDateOfPackagePurchase.setMonth(
      endDateOfPackagePurchase.getMonth() + duration
    );

    const createdPackagePurchase = {
      totalPrice,
      totalCourt,
      duration,
      priceEachCourt: packageCourt.priceEachCourt,
      startDate: startDateOfPackagePurchase,
      endDate: endDateOfPackagePurchase,
      manager: buyPackageDTO.managerId,
      packageCourt: buyPackageDTO.packageId
    };
    await packagePurchaseModel.create(createdPackagePurchase);

    managerService.update(manager._id, {
      expiredDate: endDateOfPackagePurchase,
      maxCourt: createdPackagePurchase.totalCourt
    });
  }
}

export const packageCourtService = new PackageCourtService();
