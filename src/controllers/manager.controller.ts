import { NextFunction, Request, Response } from 'express';
import { IManager } from '../interfaces/manager.interface';
import { RoleEnum, UserStatusEnum } from '../utils/enums';
import { managerService } from '../services/manager.service';

export default class ManagerController {
  static async createManager(req: Request, res: Response, next: NextFunction) {
    const managerDTO: IManager = {
      ...req.body,
      role: RoleEnum.MANAGER,
      status: UserStatusEnum.PENDING
    };
    try {
      return res.status(201).json({
        message: 'Created Manager Successfully',
        data: await managerService.createManager(managerDTO)
      });
    } catch (error) {
      next(error);
    }
  }

  static async buyPackage(req: Request, res: Response, next: NextFunction) {}
}
