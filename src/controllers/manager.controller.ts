import { NextFunction, Request, Response } from 'express';
import { IManager } from '../interfaces/manager.interface';
import { RoleEnum, UserStatusEnum } from '../utils/enums';
import { managerService } from '../services/manager.service';

export default class ManagerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: 'Get all managers success',
        data: await managerService.getAll()
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get manager by id success',
        data: await managerService.getById(id)
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const {
      username,
      email,
      password,
      gender,
      firstName,
      lastName,
      phone,
      dob,
      payments
    } = req.body;
    const managerDTO: IManager = {
      username: username ?? '',
      email,
      password,
      gender: gender ?? '',
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      phone: phone ?? '',
      dob: dob ?? '',
      payments: payments ?? '',
      role: RoleEnum.MANAGER,
      status: UserStatusEnum.ACTIVE
    };

    try {
      await managerService.createManager(managerDTO);
      return res.status(201).json({
        message: 'Create manager Successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const { gender, firstName, lastName, phone, dob } = req.body;
    const managerDTO: Partial<IManager> = {
      gender,
      firstName,
      lastName,
      phone,
      dob
    };
    try {
      await managerService.update(id, managerDTO);
      return res.status(200).json({
        message: 'Update manager success'
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
        message: 'Delete manager success'
      });
    } catch (error) {
      next(error);
    }
  }
}
