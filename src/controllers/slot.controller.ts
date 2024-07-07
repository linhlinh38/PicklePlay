import { NextFunction, Request, Response } from 'express';
import { ISlot } from '../interfaces/slot.interface';
import { slotService } from '../services/slot.service';

export default class SlotController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.params.branchId;
      const { weekDay, startTime, endTime, surcharge } = req.body;
      const slotDTO: ISlot = {
        weekDay,
        startTime,
        endTime,
        surcharge,
        branch: branchId
      };
      await slotService.createSlot(slotDTO);
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

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get slot success',
        data: await slotService.getById(id)
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const { weekDay, startTime, endTime, surcharge } = req.body;
    const slotDTO: ISlot = {
      weekDay,
      startTime,
      endTime,
      surcharge
    };
    try {
      await slotService.updateSlot(id, slotDTO);
      return res.status(200).json({
        message: 'Update slot success'
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      await slotService.delete(id);
      return res.status(200).json({
        message: 'Delete slot success'
      });
    } catch (error) {
      next(error);
    }
  }
}
