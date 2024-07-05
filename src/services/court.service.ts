import { BadRequestError } from '../errors/badRequestError';
import { NotFoundError } from '../errors/notFound';
import { ICourt } from '../interfaces/court.interface';
import { ISchedule } from '../interfaces/schedule.interface';
import branchModel from '../models/branch.model';
import courtModel from '../models/court.model';
import scheduleModel from '../models/schedule.model';
import { BranchStatusEnum, CourtStatusEnum } from '../utils/enums';
import { BaseService } from './base.service';
import { branchService } from './branch.service';
import { managerService } from './manager.service';

class CourtService extends BaseService<ICourt> {
  constructor() {
    super(courtModel);
  }

  async getMyAvailableCourts(loginUser: string) {
    const branchs = await branchModel.find({ manager: loginUser });
    const branchIds = branchs.map((branch) => branch._id);
    const courts = await courtModel.find({
      status: [CourtStatusEnum.PENDING, CourtStatusEnum.INUSE],
      branch: { $in: branchIds }
    });
    return courts;
  }

  async getAllCourtsOfManager(managerId: string) {
    const branchs = await branchModel.find({ manager: managerId });
    const branchIds = branchs.map((branch) => branch._id);
    const courts = await courtModel.find({
      branch: { $in: branchIds }
    });
    return courts;
  }

  async beforeCreate(data: ICourt): Promise<void> {
    const branch = await branchService.getById(data.branch as string);
    if (!branch) {
      throw new NotFoundError('Branch not found');
    }
    if (
      branch.status === BranchStatusEnum.DENIED ||
      branch.status === BranchStatusEnum.INACTIVE
    ) {
      throw new NotFoundError('Cannot create court for branch not working');
    }

    const availableCourt = await this.getCountAvailableCourtsOfManager(
      branch.manager as string
    );
    const manager = await managerService.getById(branch.manager as string);
    if (availableCourt === manager.maxCourt) {
      throw new BadRequestError(
        `Exceed current total court registered: ${manager.maxCourt} courts`
      );
    }
    if (branch.status === BranchStatusEnum.PENDING)
      data.status = CourtStatusEnum.PENDING;
    if (branch.status === BranchStatusEnum.ACTIVE)
      data.status = CourtStatusEnum.INUSE;
  }

  async createManyCourts(courts: ICourt[]): Promise<ICourt[]> {
    try {
      const result: ICourt[] = await courtModel.insertMany(courts);
      return result;
    } catch (error) {
      console.error('Error creating courts:', error);
      throw error;
    }
  }

  async updateManyCourts(branchId: string, status: string): Promise<void> {
    try {
      await courtModel.updateMany({ branch: branchId }, { status: status });
    } catch (error) {
      console.error('Error creating courts:', error);
      throw error;
    }
  }

  async getCountAvailableCourtsOfManager(managerId: string): Promise<number> {
    const availableBranchIdsOfManager = await branchModel.find(
      {
        manager: managerId,
        status: { $in: [BranchStatusEnum.PENDING, BranchStatusEnum.ACTIVE] }
      },
      { _id: 1 }
    );

    const availableCourtsOfManager = await courtModel.find({
      branch: { $in: availableBranchIdsOfManager },
      status: { $in: [CourtStatusEnum.PENDING, CourtStatusEnum.INUSE] }
    });

    return availableCourtsOfManager.length;
  }

  async getCourtAvailable(
    slots: string[],
    date: Date,
    branch: string
  ): Promise<number> {
    const courtBooked = await scheduleModel.find({
      slots: { $in: slots },
      date: date
    });

    let court: string[] = [];
    courtBooked.map((item: ISchedule) => {
      return court.push(item.court.toString());
    });

    const availableCourt = await courtModel.find({
      _id: { $nin: [...court] },
      branch: branch,
      status: CourtStatusEnum.INUSE
    });

    return availableCourt;
  }
}

export const courtService = new CourtService();
