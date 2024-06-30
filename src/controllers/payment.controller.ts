import { NextFunction, Request, Response } from 'express';
import { paymentService } from '../services/payment.service';
import { AuthRequest } from '../middlewares/authentication';
import { IPayment } from '../interfaces/payment.interface';

export default class PaymentController {
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
  static createPaymentUrl(req: Request, res: Response, next: NextFunction) {
    const { amount, returnUrl, bookingId } = req.body;
    try {
      return res.status(200).json({
        message: 'Return url success',
        data: bookingId
          ? paymentService.createPaymentUrl(amount, returnUrl, bookingId)
          : paymentService.createPaymentUrl(amount, returnUrl)
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
