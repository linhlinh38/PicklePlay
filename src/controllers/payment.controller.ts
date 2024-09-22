import { NextFunction, Request, Response } from 'express';
import { paymentService } from '../services/payment.service';
import { AuthRequest } from '../middlewares/authentication';
import { IPayment } from '../interfaces/payment.interface';
import { IBuyPackage } from '../interfaces/buyPackage.interface';
import paymentModel from '../models/payment.model';
import cardModel from '../models/card.model';
import { BadRequestError } from '../errors/badRequestError';
export default class PaymentController {
  static async deletePayment(req: Request, res: Response, next: NextFunction) {
    try {
      await paymentService.delete(req.params.id);
      return res.status(200).json({
        message: 'Delete payment success'
      });
    } catch (err) {
      next(err);
    }
  }
  static async getMyPayments(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      return res.status(200).json({
        message: 'Get payments success',
        data: await paymentService.getMyPayments(req.loginUser)
      });
    } catch (err) {
      next(err);
    }
  }

  static async createPaymentUrl(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { packageId, totalCourt, description } = req.body;
    const buyPackageDTO: Partial<IBuyPackage> = {
      packageId,
      totalCourt,
      managerId: req.loginUser,
      description
    };
    try {
      return res.status(200).json({
        message: 'Return url success',
        data: await paymentService.createPaymentUrl(buyPackageDTO)
      });
    } catch (err) {
      next(err);
    }
  }

  static async createPaymentUrlForBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    const { amount, description } = req.body;
    const userId = req.loginUser;
    const payment = await paymentModel.findOne({
      owner: userId
    });
    const card = await cardModel.findOne({
      accountNumber: payment.accountNumber,
      accountName: payment.accountName,
      accountBank: payment.accountBank
    });
    if (!card) throw new BadRequestError('Card is invalid');
    const keyData = {
      apiKey: card.apiKey,
      clientId: card.clientId,
      checksumKey: card.checksumKey
    };
    try {
      return res.status(200).json({
        message: 'Return url success',
        data: await paymentService.getPaymentUrl(amount, description, keyData)
      });
    } catch (err) {
      next(err);
    }
  }

  static verifySuccessUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const isSuccess = paymentService.verifySuccessUrl(req.body.url as string);
      return res.status(isSuccess ? 200 : 400).json({
        message: isSuccess ? 'Valid url' : 'Invalid url'
      });
    } catch (err) {
      next(err);
    }
  }

  static async addPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { accountNumber, accountName, accountBank, expDate } = req.body;
      const paymentDTO: IPayment = {
        accountNumber,
        accountName,
        accountBank,
        expDate,
        owner: req.loginUser
      };

      await paymentService.addPayment(paymentDTO);
      return res.status(200).json({
        message: 'Add payment success'
      });
    } catch (err) {
      next(err);
    }
  }
}
