import { NextFunction, Request, Response } from 'express';
import { ITransaction } from '../interfaces/transaction.interface';
import { transactionService } from '../services/transaction.service';

export default class TransactionController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { amount, from, to, content, type } = req.body;
    const transactionDTO: ITransaction = { amount, from, to, content, type };
    try {
      await transactionService.createTransaciton(transactionDTO);
      res.status(200).json({
        message: 'Create transaction success'
      });
    } catch (err) {
      next(err);
    }
  }
  static async getOfUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    try {
      res.status(200).json({
        message: 'Get transactions success',
        data: await transactionService.getOfUser(userId)
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      return res.status(200).json({
        message: 'Get transaction success',
        data: await transactionService.getById(id)
      });
    } catch (error) {
      next(error);
    }
  }
}
