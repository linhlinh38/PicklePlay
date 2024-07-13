import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import { BranchStatusEnum, WeekDayEnum } from '../utils/enums';
import { courtService } from './court.service';
import { ICourtReport } from '../interfaces/courtReport.interface';
import { branchService } from './branch.service';
import courtReportModel from '../models/courtReport.model';
import { userService } from './user.service';
import { ISlot } from '../interfaces/slot.interface';
import slotModel from '../models/slot.model';
import { BadRequestError } from '../errors/badRequestError';
import scheduleModel from '../models/schedule.model';
import branchModel from '../models/branch.model';

class SlotService extends BaseService<ISlot> {
  constructor() {
    super(slotModel);
  }

  async updateSlot(id: string, slotDTO: ISlot) {
    const slot = await slotModel.findById(id).populate({
      path: 'branch',
      populate: {
        path: 'slots'
      }
    });
    if (!slot) throw new BadRequestError('Slot not found');
    if (branchService.compareTime(slotDTO.startTime, slotDTO.endTime) > 0)
      throw new BadRequestError('Start time must be before End time');
    const currentDate = new Date();
    const upcomingSchedules = await scheduleModel.find({
      slots: { $elemMatch: { $eq: slot._id } },
      date: { $gt: currentDate }
    });
    if (upcomingSchedules && upcomingSchedules.length > 0)
      throw new BadRequestError(
        'Can not update slots as it has upcoming schedules'
      );
    const otherSlots = slot.branch.slots.filter(
      (slotItem) => slotItem._id.toString() != slot._id.toString()
    );
    const isOverSlap = !branchService.checkSlots([...otherSlots, slot]);
    if (isOverSlap) throw new BadRequestError('Slots are overlap');
    if (
      !branchService.areSlotsValidWithAvailableTime(
        [slotDTO],
        slot.branch.availableTime
      )
    ) {
      throw new BadRequestError('Slot is invalid with branch available time');
    }
    slotService.update(id, slotDTO);
  }

  async createSlot(slotDTO: ISlot) {
    const branch = await branchModel.findById(slotDTO.branch).populate('slots');
    if (!branch) throw new NotFoundError('Branch not found');
    const slots = branch.slots;
    if (branchService.compareTime(slotDTO.startTime, slotDTO.endTime) > 0)
      throw new BadRequestError('Start time must be before End time');
    if (slots.length > 0 && !branchService.checkSlots([...slots, slotDTO]))
      throw new BadRequestError('Slots are overlap');
    if (
      !branchService.areSlotsValidWithAvailableTime(
        [slotDTO],
        branch.availableTime
      )
    ) {
      throw new BadRequestError('Slot is invalid with branch available time');
    }
    const slot = await slotModel.create(slotDTO);
    branch.slots = [...branch.slots, slot._id];
    await branch.save();
  }

  async beforeCreate(slotDTO: ISlot): Promise<void> {
    const branch = await branchService.getById(slotDTO.branch);
    if (!branch) throw new NotFoundError('Branch not found');
  }

  getWeekDayFromDate(date: Date) {
    const weekDayArray = [
      WeekDayEnum.SUNDAY,
      WeekDayEnum.MONDAY,
      WeekDayEnum.TUESDAY,
      WeekDayEnum.WEDNESDAY,
      WeekDayEnum.THURSDAY,
      WeekDayEnum.FRIDAY,
      WeekDayEnum.SATURDAY
    ];
    const dayIndex = date.getDay(); // Returns 0 for Sunday, 1 for Monday, etc.
    return weekDayArray[dayIndex];
  }

  async getSlotsOfCourtByDate(date: Date, courtId: string) {
    // const curDate = new Date();
    // curDate.setHours(0);
    // curDate.setMinutes(0);
    // curDate.setSeconds(0);
    // if (date < curDate)
    //   throw new BadRequestError('Date can not be in the past');
    const court = await courtService.getById(courtId);
    if (!court) throw new NotFoundError('Court not found');
    const slots = await slotModel.find({
      weekDay: this.getWeekDayFromDate(date),
      branch: court.branch
    });
    const schedules = await scheduleModel.find({
      court: courtId,
      date: date
    });
    return slots.filter((slot) => {
      let isAvailable = true;
      schedules.forEach((schedule) => {
        if (schedule.slots.includes(slot._id)) isAvailable = false;
      });
      return isAvailable;
    });
    // return slots.map((slot) => {
    //   const schedule = schedules.find((schedule) =>
    //     schedule.slots.includes(slot._id)
    //   );
    //   slot = { ...slot.toObject(), schedule };
    //   return slot;
    // });
  }

  async getSlotsOfBranch(branchId: string) {
    const branch = await branchService.getById(branchId);
    if (!branch) throw new NotFoundError('Branch not found');

    const slots = await slotModel.find({
      branch: branchId
    });
    return slots;
  }

  async createCourtReport(reportDTO: ICourtReport, creatorId: string) {
    const creator = await userService.getById(creatorId);
    if (!creator) throw new NotFoundError('Creator not found');
    reportDTO.creator = creatorId;
    await courtReportModel.create(reportDTO);
  }

  async getReportsOfBranch(branchId: string) {
    const branch = await branchService.getById(branchId);
    if (!branch) throw new NotFoundError('Branch not found');

    const courtIds = branch.courts;
    const reports = await courtReportModel
      .find({
        court: { $in: courtIds }
      })
      .populate('staff court');

    return reports;
  }

  async getReportsOfCourt(courtId: string) {
    const court = await courtService.getById(courtId);
    if (!court) throw new NotFoundError('Court not found');

    const reports = await courtReportModel
      .find({
        court: courtId
      })
      .populate('staff');

    return reports;
  }

  async getAllBranchesOfManager(managerId: string) {
    const manager = await managerService.getById(managerId);
    if (!manager) throw new NotFoundError('Manager not found');

    return await this.model.find({
      manager: manager._id,
      status: BranchStatusEnum.ACTIVE
    });
  }
}

export const slotService = new SlotService();
