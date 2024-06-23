import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import branchModel from '../models/branch.model';
import { IBranch } from '../interfaces/branch.interface';
import { BadRequestError } from '../errors/badRequestError';
import { BranchStatusEnum, CourtStatusEnum } from '../utils/enums';
import { ICourt } from '../interfaces/court.interface';
import courtModel from '../models/court.model';
import { courtService } from './court.service';
import slotModel from '../models/slot.model';
import { ISlot } from '../interfaces/slot.interface';
import scheduleModel from '../models/schedule.model';

class BranchService extends BaseService<IBranch> {
  constructor() {
    super(branchModel);
  }

  async updateStatus(branchId: string, status: string) {
    const branch = await branchService.getById(branchId);
    if (!branch) throw new NotFoundError('Branch not found');
    if (
      ![
        BranchStatusEnum.ACTIVE.toString(),
        BranchStatusEnum.INACTIVE.toString()
      ].includes(status)
    )
      throw new BadRequestError('Status only accepts Active/Inactive');
    if (
      branch.status == BranchStatusEnum.PENDING ||
      branch.status == BranchStatusEnum.DENIED
    )
      throw new BadRequestError(
        'Can not update status of branch while they are Pending/Denied'
      );
    branch.status = status;
    await branchService.update(branchId, branch);
    if (status == BranchStatusEnum.INACTIVE) {
      await courtModel.updateMany(
        { branch: branchId },
        { $set: { status: CourtStatusEnum.TERMINATION } }
      );
    }
  }

  async handleRequest(branchId: string, approve: string) {
    const branch = await branchService.getById(branchId);
    if (!branch) throw new NotFoundError('Branch not found');
    if (branch.status != BranchStatusEnum.PENDING)
      throw new BadRequestError('Branch is not pending');
    if (approve) {
      // update branch status
      branch.status = BranchStatusEnum.ACTIVE;
      await Promise.all([
        branchService.update(branchId, branch),
        courtModel.updateMany(
          { branch: branchId },
          { status: CourtStatusEnum.INUSE }
        )
      ]);
    } else {
      branch.status = BranchStatusEnum.DENIED;
      await Promise.all([
        branchService.update(branchId, branch),
        courtModel.updateMany(
          { branch: branchId },
          { status: CourtStatusEnum.TERMINATION }
        )
      ]);
    }
  }

  async getPendingBranches() {
    return await this.model.find({
      status: BranchStatusEnum.PENDING
    });
  }

  async getPopularBranches() {
    const result = await scheduleModel.aggregate([
      {
        $lookup: {
          from: 'courts',
          localField: 'court',
          foreignField: '_id',
          as: 'courtDetails'
        }
      },
      {
        $unwind: '$courtDetails'
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'courtDetails.branch',
          foreignField: '_id',
          as: 'branchDetails'
        }
      },
      {
        $unwind: '$branchDetails'
      },
      {
        $group: {
          _id: '$branchDetails._id',
          scheduleCount: { $sum: 1 }
        }
      },
      {
        $sort: { scheduleCount: -1 }
      }
    ]);
    return result;
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

    const getCountAvailableCourtsOfManager =
      await courtService.getCountAvailableCourtsOfManager(manager._id);

    if (
      getCountAvailableCourtsOfManager + branchDTO.courts.length >
      manager.maxCourt
    ) {
      throw new BadRequestError(
        `Exceed current total court registered (${manager.maxCourt})`
      );
    }

    const courts = branchDTO.courts;
    delete branchDTO.courts;
    const slots = branchDTO.slots;
    delete branchDTO.slots;

    const savedBranch = await branchModel.create(branchDTO);

    // save courts
    const formatCourts: ICourt[] = courts.map((court) => {
      return {
        name: court.name,
        type: court.type,
        price: court.price,
        images: court.images,
        description: court.description,
        status: CourtStatusEnum.PENDING,
        branch: savedBranch._id
      };
    });
    const savedCourts = await courtModel.insertMany(formatCourts);

    //save slots
    const formatSlots: ISlot[] = slots.map((slot) => {
      return { ...slot, branch: savedBranch._id };
    });
    const savedSlots = await slotModel.insertMany(formatSlots);

    savedBranch.courts = savedCourts.map((court) => court._id);
    savedBranch.slots = savedSlots.map((slot) => slot._id);

    await savedBranch.save();
  }
}

export const branchService = new BranchService();
