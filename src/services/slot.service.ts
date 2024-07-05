import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import { BranchStatusEnum, RoleEnum, WeekDayEnum } from '../utils/enums';
import { courtService } from './court.service';
import { ICourtReport } from '../interfaces/courtReport.interface';
import { branchService } from './branch.service';
import courtReportModel from '../models/courtReport.model';
import { userService } from './user.service';
import { ISlot } from '../interfaces/slot.interface';
import slotModel from '../models/slot.model';
import { BadRequestError } from '../errors/badRequestError';
import scheduleModel from '../models/schedule.model';

class SlotService extends BaseService<ISlot> {
  constructor() {
    super(slotModel);
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
    const curDate = new Date();
    curDate.setHours(0);
    curDate.setMinutes(0);
    curDate.setSeconds(0);
    if (date < curDate)
      throw new BadRequestError('Date can not be in the past');
    const court = await courtService.getById(courtId);
    if (!court) throw new NotFoundError('Court not found');

    const slots = await slotModel.aggregate([
      {
        $match: { branch: court.branch, weekDay: this.getWeekDayFromDate(date) }
      },
      {
        $addFields: {
          startTimeObj: { $dateFromString: { dateString: '$startTime' } }
        }
      },
      {
        $sort: { startTimeObj: 1 }
      }
    ]);
    const slotIds = slots.map((slot) => slot._id);
    const schedules = await scheduleModel.find({
      slots: { $in: slotIds },
      date: date
    });
    return slots.map((slot) => {
      const schedule = schedules.find((schedule) =>
        schedule.slots.includes(slot._id)
      );
      slot.schedule = schedule;
      return slot;
    });
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
