import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import { BranchStatusEnum, RoleEnum } from '../utils/enums';
import { courtService } from './court.service';
import { ICourtReport } from '../interfaces/courtReport.interface';
import { branchService } from './branch.service';
import courtReportModel from '../models/courtReport.model';
import { userService } from './user.service';

class CourtReportService extends BaseService<ICourtReport> {
  async getReportById(id: string) {
    return await courtReportModel.findById(id).populate('user court');
  }
  constructor() {
    super(courtReportModel);
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
      .populate('creator court');

    return reports;
  }

  async getReportsOfCourt(courtId: string) {
    const court = await courtService.getById(courtId);
    if (!court) throw new NotFoundError('Court not found');

    const reports = await courtReportModel
      .find({
        court: courtId
      })
      .populate('creator court');

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

export const courtReportService = new CourtReportService();
