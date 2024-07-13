import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import branchModel from '../models/branch.model';
import { IBranch } from '../interfaces/branch.interface';
import { BadRequestError } from '../errors/badRequestError';
import {
  BranchStatusEnum,
  CourtStatusEnum,
  RoleEnum,
  ScheduleStatusEnum
} from '../utils/enums';
import { ICourt } from '../interfaces/court.interface';
import courtModel from '../models/court.model';
import { courtService } from './court.service';
import slotModel from '../models/slot.model';
import { ISlot } from '../interfaces/slot.interface';
import scheduleModel from '../models/schedule.model';
import userModel from '../models/user.model';

class BranchService extends BaseService<IBranch> {
  constructor() {
    super(branchModel);
  }

  async updateBranch(id: string, branchDTO: Partial<IBranch>) {
    const branch = await branchModel.findById(id);
    if (!branch) throw new BadRequestError('Branch not found');
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
    if (user.role == RoleEnum.STAFF) {
      const staff = await userModel.findById(userId).populate('branch');
      return [staff.branch];
    }
    if ([RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user.role)) {
      return await branchModel.find({});
    }
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
    return branch;
  }

  async getPendingBranches() {
    return await this.model.find({
      status: BranchStatusEnum.PENDING
    });
  }

  async getPopularBranches() {
    const branches = await branchModel.find({});
    const branchesObject = await Promise.all(
      branches.map(async (branch) => {
        const schedules = await scheduleModel.find({
          court: { $in: branch.courts },
          status: {
            $in: [ScheduleStatusEnum.AVAILABLE, ScheduleStatusEnum.DONE]
          }
        });
        return { ...branch.toObject(), totalSchedule: schedules.length };
      })
    );

    const sortedBranches = branchesObject.sort(
      (a, b) => b.totalSchedule - a.totalSchedule
    );
    return sortedBranches;
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

    //save slots
    const formatSlots: ISlot[] = slots.map((slot) => {
      return { ...slot, branch: savedBranch._id };
    });

    formatSlots.forEach((slot) => {
      if (this.compareTime(slot.startTime, slot.endTime) > 0)
        throw new BadRequestError('Start time must be before End time');
    });
    if (formatSlots.length > 0 && !this.checkSlots(formatSlots)) {
      await branchModel.findByIdAndDelete(savedBranch._id);
      throw new BadRequestError('Slots are overlap');
    }

    if (
      formatSlots.length > 0 &&
      !this.areSlotsValidWithAvailableTime(formatSlots, branchDTO.availableTime)
    ) {
      await branchModel.findByIdAndDelete(savedBranch._id);
      throw new BadRequestError(
        'Some slots are invalid with branch available time'
      );
    }

    const savedSlots = await slotModel.insertMany(formatSlots);
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

    savedBranch.courts = savedCourts.map((court) => court._id);
    savedBranch.slots = savedSlots.map((slot) => slot._id);

    await savedBranch.save();
  }

  areSlotsValidWithAvailableTime(slots: ISlot[], availableTime: string) {
    const startTime = availableTime.split('-')[0];
    const endTime = availableTime.split('-')[1];
    for (const slot of slots) {
      if (
        this.compareTime(slot.startTime, startTime) < 0 ||
        this.compareTime(slot.endTime, endTime) > 0
      ) {
        return false;
      }
    }
    return true;
  }

  compareTime(time1: string, time2: string) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const date1 = new Date();
    date1.setHours(hours1, minutes1, 0, 0);

    const date2 = new Date();
    date2.setHours(hours2, minutes2, 0, 0);

    return date1.getTime() - date2.getTime();
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
    for (let i = 0; i < slots.length - 1; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (
          this.convertToDate(slots[i].startTime) <
            this.convertToDate(slots[j].endTime) &&
          this.convertToDate(slots[j].startTime) <
            this.convertToDate(slots[i].endTime)
        ) {
          return false;
        }
        if (
          this.convertToDate(slots[i].startTime) ==
            this.convertToDate(slots[j].endTime) &&
          this.convertToDate(slots[j].startTime) ==
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
