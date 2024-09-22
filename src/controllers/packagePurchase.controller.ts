import { NextFunction, Request, Response } from 'express';
import { packagePurchaseService } from '../services/packagePurchase.service';
import { packageCourtService } from '../services/packageCourt.service';
import { IBuyPackage } from '../interfaces/buyPackage.interface';
import { AuthRequest } from '../middlewares/authentication';

export default class PackagePurchaseController {
  static async getPurchasesOfManager(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const managerId = req.loginUser;
    try {
      return res.status(200).json({
        message: 'Get all purchase packages success',
        data: await packagePurchaseService.getPurchasesOfManager(managerId)
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: 'Get all purchase packages success',
        data: await packagePurchaseService.getAll()
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
        data: await packagePurchaseService.getById(id)
      });
    } catch (error) {
      next(error);
    }
  }

  static async buyPackageCourt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { packageId, managerId, duration, totalCourt } = req.body;
    const buyPackageDTO: IBuyPackage = {
      packageId,
      managerId,
      duration,
      totalCourt
    };

    try {
      await packageCourtService.buyPackageCourt(buyPackageDTO);
      return res.status(200).json({
        message: 'Buy package Successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async buyPackageFull(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { packageId, totalCourt, orderCode } = req.body;
    const buyPackageDTO: Partial<IBuyPackage> = {
      packageId,
      totalCourt,
      managerId: req.loginUser,
      orderCode
    };

    try {
      return res.status(200).json({
        message: 'Buy package Successfully',
        data: await packageCourtService.buyPackageFull(buyPackageDTO)
      });
    } catch (error) {
      next(error);
    }
  }
}
