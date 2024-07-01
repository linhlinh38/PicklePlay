import { BaseService } from './base.service';
import packagePurchaseModel from '../models/packagePurchase.model';
import { IPackagePurchase } from '../interfaces/packagePurchase.interface';
import { managerService } from './manager.service';
import { NotFoundError } from '../errors/notFound';
import { PackagePurchaseStatusEnum } from '../utils/enums';

class PackagePurchaseService extends BaseService<IPackagePurchase> {
  constructor() {
    super(packagePurchaseModel);
  }

  async getPurchasesOfManager(managerId: string) {
    const manager = await managerService.getById(managerId);
    if (!manager) throw new NotFoundError('User not found');
    return await this.model
      .find({ manager: manager._id, status: PackagePurchaseStatusEnum.ACTIVE })
      .populate('packageCourt');
  }
}

export const packagePurchaseService = new PackagePurchaseService();
