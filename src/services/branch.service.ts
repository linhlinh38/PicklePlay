import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import branchModel from '../models/branch.model';
import { IBranch } from '../interfaces/branch.interface';
import { BadRequestError } from '../errors/badRequestError';
import { BranchStatusEnum, CourtStatusEnum, RoleEnum } from '../utils/enums';
import { ICourt } from '../interfaces/court.interface';
import courtModel from '../models/court.model';
import { courtService } from './court.service';
import slotModel from '../models/slot.model';
import { ISlot } from '../interfaces/slot.interface';
import scheduleModel from '../models/schedule.model';
import userModel from '../models/user.model';
import { slotService } from './slot.service';

class BranchService extends BaseService<IBranch> {
  constructor() {
    super(branchModel);
  }

  async updateBranch(id: string, branchDTO: Partial<IBranch>) {
    const branch = await branchModel.findById(id);
    if (!branch) throw new BadRequestError('Branch not found');
    if (branchDTO.slots && branchDTO.slots.length > 0) {
      const currentDate = new Date();
      const slotIds = branchDTO.slots.map((slot) => slot._id);
      const upcomingSchedules = await scheduleModel.find({
        slots: { $in: slotIds },
        date: { $gt: currentDate }
      });
      if (upcomingSchedules && upcomingSchedules.length > 0)
        throw new BadRequestError(
          'Can not update slots as they have upcoming schedules'
        );
      const isOverSlap = branchService.checkSlots(branchDTO.slots);
      if (isOverSlap) throw new BadRequestError('Slots are overlap');
      branchDTO.slots.forEach((slot) => {
        slotService.update(slot._id, slot);
      });
    }
    const branchData = {
      name: branchDTO.name,
      phone: branchDTO.phone,
      address: branchDTO.address,
      licenses: branchDTO.licenses,
      description: branchDTO.description,
      availableTime: branchDTO.availableTime,
      images: branchDTO.images
    };
    branchService.update(id, branchData);
  }

  async getBranchById(id: string) {
    return await branchModel.findById(id).populate('slots courts');
  }

  async getMyBranchs(userId: string) {
    const user = await userModel.findById(userId);
    if (user.role == RoleEnum.MANAGER)
      return await branchModel.find({
        manager: userId
      });
    const staff = await userModel.findById(userId).populate('branch');
    return staff.branch;
  }
  async searchByNameOrAddress(keyword: string) {
    const branches = await branchModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } }
      ]
    });
    return branches;
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

    if (formatSlots.length > 0 && !this.checkSlots(formatSlots))
      throw new BadRequestError('Slots are overlap');
    const savedSlots = await slotModel.insertMany(formatSlots);

    savedBranch.courts = savedCourts.map((court) => court._id);
    savedBranch.slots = savedSlots.map((slot) => slot._id);

    await savedBranch.save();
  }

  checkSlots(slots: ISlot[]) {
    const slotMap = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };
    slots.forEach((slot) => {
      slotMap[slot.weekDay].push(slot);
    });
    for (const day of Object.keys(slotMap)) {
      if (!this.doSlotsOverLap(slotMap[day])) return false;
    }
    return true;
  }
  doSlotsOverLap(slots: ISlot[]) {
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (
          this.convertToDate(slots[i].startTime) <
            this.convertToDate(slots[j].endTime) &&
          this.convertToDate(slots[j].startTime) <
            this.convertToDate(slots[i].endTime)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  convertToDate(timeString: string) {
    return new Date(`1970-01-01T${timeString}:00`);
  }
}

export const branchService = new BranchService();
