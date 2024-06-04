import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import branchModel from '../models/branch.model';
import { IBranch } from '../interfaces/branch.interface';
import { filesUploadProcessing } from '../utils/fileUploadProcessing';
import { BadRequestError } from '../errors/badRequestError';
import { BranchStatusEnum } from '../utils/enums';

class BranchService extends BaseService<IBranch> {
  constructor() {
    super(branchModel);
  }

  async getPendingBranches() {
    return await this.model.find({
      status: BranchStatusEnum.PENDING
    });
  }

  async getAllBranchesOfManager(managerId: string) {
    const manager = await managerService.getById(managerId);
    if (!manager) throw new NotFoundError('Manager not found');

    return await this.model.find({
      manager: manager._id,
      status: BranchStatusEnum.ACTIVE
    });
  }

  async requestCreateBranch(branchDTO: IBranch) {
    const manager = await managerService.getById(branchDTO.manager as string);
    if (!manager) throw new NotFoundError('Manager not found');

    const branchesOfManager = await this.getAllBranchesOfManager(manager._id);
    const currentNumOfBranches = branchesOfManager.reduce(
      (accumulator, currentValue) => accumulator + currentValue.totalCourt,
      0
    );
    if (currentNumOfBranches + branchDTO.totalCourt > manager.maxCourt) {
      throw new BadRequestError(
        `Exceed current total court registered (${manager.maxCourt})`
      );
    }

    if (branchDTO.images && branchDTO.images.length > 0) {
      branchDTO.images = await filesUploadProcessing(
        branchDTO.images as Express.Multer.File[]
      );
    }

    await branchModel.create(branchDTO);
  }
}

export const branchService = new BranchService();
