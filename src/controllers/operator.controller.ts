import { NextFunction, Request, Response } from 'express';
import { IManager } from '../interfaces/manager.interface';
import { RoleEnum, UserStatusEnum } from '../utils/enums';
import { operatorService } from '../services/operator.service';
import { IUser } from '../interfaces/user.interface';
import { userService } from '../services/user.service';
import { EmailAlreadyExistError } from '../errors/emailAlreadyExistError';
import { encryptedPassword } from '../utils/jwt';

export default class OperatorController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: 'Get all operators success',
        data: await operatorService.getAll()
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get operator by id success',
        data: await operatorService.getById(id)
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
      dob
    } = req.body;
    const operatorDTO: IUser = {
      username,
      email,
      password,
      gender,
      firstName,
      lastName,
      phone,
      dob,
      role: RoleEnum.OPERATOR,
      status: UserStatusEnum.ACTIVE
    };

    try {
      const key: Partial<IUser> = {
        email: req.body.email
      };
      const operator = await userService.search(key);

      if (operator.length !== 0) {
        throw new EmailAlreadyExistError('Email already exists!');
      }
      if (operatorDTO.password) {
        operatorDTO.password = await encryptedPassword(req.body.password);
      }
      await operatorService.create(operatorDTO);
      return res.status(201).json({
        message: 'Create operator Successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const { gender, firstName, lastName, phone, dob } = req.body;
    const operator: Partial<IUser> = {
      gender,
      firstName,
      lastName,
      phone,
      dob
    };
    try {
      await operatorService.update(id, operator);
      return res.status(200).json({
        message: 'Update operator success'
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      await operatorService.delete(id);
      return res.status(200).json({
        message: 'Delete operator success'
      });
    } catch (error) {
      next(error);
    }
  }
}
