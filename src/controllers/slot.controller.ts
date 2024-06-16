import { NextFunction, Request, Response } from 'express';
import { courtReportService } from '../services/courtReport.service';
import { ICourtReport } from '../interfaces/courtReport.interface';
import { AuthRequest } from '../middlewares/authentication';
import { slotService } from '../services/slot.service';
import { ISlot } from '../interfaces/slot.interface';

export default class SlotController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.params.branchId;
      const { name, weekDay, startTime, endTime, surcharge } = req.body;
      const slotDTO: ISlot = {
        name,
        weekDay,
        startTime,
        endTime,
        surcharge,
        branch: branchId
      };
      await slotService.create(slotDTO);
      res.status(200).json({
        message: 'Create slot success'
      });
    } catch (err) {
      next(err);
    }
  }
  static async getSlotsOfCourtByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { date, courtId } = req.body;
    try {
      res.status(200).json({
        message: 'Get slots success',
        data: await slotService.getSlotsOfCourtByDate(new Date(date), courtId)
      });
    } catch (err) {
      next(err);
    }
  }
  static async getSlotsOfBranch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const branchId = req.params.branchId;
      res.status(200).json({
        message: 'Get slots success',
        data: await slotService.getSlotsOfBranch(branchId)
      });
    } catch (err) {
      next(err);
    }
  }
  static async getReportsOfBranch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const branchId = req.params.branchId;
      res.status(200).json({
        message: 'Get reports success',
        data: await courtReportService.getReportsOfBranch(branchId)
      });
    } catch (err) {
      next(err);
    }
  }

  static async getReportsOfCourt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const courtId = req.params.courtId;
      res.status(200).json({
        message: 'Get reports success',
        data: await courtReportService.getReportsOfCourt(courtId)
      });
    } catch (err) {
      next(err);
    }
  }

  static async createCourtReport(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const courtId = req.params.courtId;
      const { note, description, images, status } = req.body;
      const reportDTO: ICourtReport = {
        note,
        description,
        images,
        status,
        court: courtId
      };
      const creatorId = req.loginUser;
      await courtReportService.createCourtReport(reportDTO, creatorId);
      res.status(200).json({
        message: 'Create report success'
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get report success',
        data: await courtReportService.getById(id)
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const { note, description, images, status } = req.body;
    const courtReportDTO: Partial<ICourtReport> = {
      note,
      description,
      images,
      status
    };
    try {
      await courtReportService.update(id, courtReportDTO);
      return res.status(200).json({
        message: 'Update report success'
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      await courtReportService.delete(id);
      return res.status(200).json({
        message: 'Delete report success'
      });
    } catch (error) {
      next(error);
    }
  }
}
