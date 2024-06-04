import { NextFunction, Request, Response } from 'express';
import { IBranch } from '../interfaces/branch.interface';
import { branchService } from '../services/branch.service';
import { BranchStatusEnum } from '../utils/enums';

export default class BranchController {
  static async getPendingBranches(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      return res.status(200).json({
        message: 'Get pending branches success',
        data: await branchService.search({ status: BranchStatusEnum.PENDING })
      });
    } catch (error) {
      next(error);
    }
  }
  static async requestCreateBranch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const {
      name,
      phone,
      address,
      license,
      totalCourt,
      slotDuration,
      description,
      availableTimes,
      managerId
    } = req.body;
    const branchDTO: IBranch = {
      name,
      phone,
      address,
      license,
      totalCourt,
      slotDuration,
      description,
      availableTimes,
      manager: managerId,
      status: BranchStatusEnum.PENDING
    };
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      branchDTO.images = req.files;
    }
    try {
      await branchService.requestCreateBranch(branchDTO);
      return res.status(200).json({
        message: 'Send create branch request success'
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: 'Get all branches success',
        data: await branchService.getAll()
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllBranchesOfManager(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const managerId = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get branches success',
        data: await branchService.getAllBranchesOfManager(managerId)
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get branch success',
        data: await branchService.getById(id)
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const {
      name,
      phone,
      address,
      license,
      totalCourt,
      slotDuration,
      description,
      availableTimes
    } = req.body;
    const branchDTO: Partial<IBranch> = {
      name,
      phone,
      address,
      license,
      totalCourt,
      slotDuration,
      description,
      availableTimes
    };
    try {
      await branchService.update(id, branchDTO);
      return res.status(200).json({
        message: 'Update branch success'
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      await branchService.update(id, { status: BranchStatusEnum.INACTIVE });
      return res.status(200).json({
        message: 'Delete branch success'
      });
    } catch (error) {
      next(error);
    }
  }
}
