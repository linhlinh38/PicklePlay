import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import branchModel from '../models/branch.model';
import { IBranch } from '../interfaces/branch.interface';
import { filesUploadProcessing } from '../utils/fileUploadProcessing';
import { BadRequestError } from '../errors/badRequestError';
import { BranchStatusEnum, CourtStatusEnum } from '../utils/enums';
import { ICourt } from '../interfaces/court.interface';
import { courtService } from './court.service';

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

  async requestCreateBranch(BranchRequest: IBranch, CourtRequest: ICourt[]) {
    const branchDTO: IBranch = {
      name: BranchRequest.name,
      phone: BranchRequest.phone,
      address: BranchRequest.address,
      license: BranchRequest.license,
      images: BranchRequest.images,
      totalCourt: BranchRequest.totalCourt,
      slotDuration: BranchRequest.slotDuration,
      description: BranchRequest.description,
      availableTimes: BranchRequest.availableTimes,
      manager: BranchRequest.manager,
      status: BranchStatusEnum.PENDING
    };

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

    const newBranch = await branchModel.create(branchDTO);

    // if (branchDTO.images && branchDTO.images.length > 0) {
    //   branchDTO.images = await filesUploadProcessing(
    //     branchDTO.images as Express.Multer.File[]
    //   );
    // }

    const newCourt: ICourt[] = CourtRequest.map((court) => {
      return {
        name: court.name,
        type: court.type,
        price: court.price,
        images: court.images,
        description: court.description,
        status: CourtStatusEnum.PENDING,
        branch: newBranch._id
      };
    });
    await courtService.createManyCourts(newCourt);
  }
}

export const branchService = new BranchService();
