import { NextFunction, Request, Response } from 'express';
import { managerService } from '../services/manager.service';
import { IPackageCourt } from '../interfaces/packageCourt.interface';
import { packageCourtService } from '../services/packageCourt.service';
import { AuthRequest } from '../middlewares/authentication';

export default class PackageCourtController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: 'Get court packages success',
        data: await packageCourtService.getAllPackages(req.loginUser)
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get court package success',
        data: await packageCourtService.getById(id)
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      totalPrice,
      priceEachCourt,
      maxCourt,
      duration,
      description,
      type
    } = req.body;
    const packageCourtDTO: IPackageCourt = {
      name,
      totalPrice,
      priceEachCourt,
      maxCourt,
      duration,
      description,
      type
    };

    try {
      await packageCourtService.createPackage(packageCourtDTO);
      return res.status(201).json({
        message: 'Create package Successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const {
      name,
      totalPrice,
      priceEachCourt,
      maxCourt,
      duration,
      description,
      status
    } = req.body;
    const packageCourtDTO: Partial<IPackageCourt> = {
      name,
      totalPrice,
      priceEachCourt,
      maxCourt,
      duration,
      description,
      status
    };
    try {
      await packageCourtService.update(id, packageCourtDTO);
      return res.status(200).json({
        message: 'Update package success'
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      await managerService.delete(id);
      return res.status(200).json({
        message: 'Delete package success'
      });
    } catch (error) {
      next(error);
    }
  }
}
