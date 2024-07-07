import { NextFunction, Request, Response } from 'express';
import { ITransaction } from '../interfaces/transaction.interface';
import { transactionService } from '../services/transaction.service';
import { AuthRequest } from '../middlewares/authentication';

export default class TransactionController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { amount, from, to, type, paymentId, paymentMethod } = req.body;
    const transactionDTO: ITransaction = {
      amount,
      from,
      to,
      type,
      payment: paymentId,
      paymentMethod
    };
    try {
      await transactionService.createTransaction(transactionDTO);
      res.status(200).json({
        message: 'Create transaction success'
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMyTransactions(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.loginUser;
    try {
      res.status(200).json({
        message: 'Get transactions success',
        data: await transactionService.getMyTransactions(userId)
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
