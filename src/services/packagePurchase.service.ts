import { BaseService } from './base.service';
import packagePurchaseModel from '../models/packagePurchase.model';
import { IPackagePurchase } from '../interfaces/packagePurchase.interface';
import { managerService } from './manager.service';
import { NotFoundError } from '../errors/notFound';

class PackagePurchaseService extends BaseService<IPackagePurchase> {
  constructor() {
    super(packagePurchaseModel);
  }

  async getPurchasesOfManager(managerId: string) {
    const manager = await managerService.getById(managerId);
    if (!manager) throw new NotFoundError('Manager not found');
    return await this.model.find({ manager: manager._id });
  }
}

export const packagePurchaseService = new PackagePurchaseService();
