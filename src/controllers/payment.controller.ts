import { NextFunction, Request, Response } from 'express';
import PaymentService from '../services/payment.service';

export default class PaymentController {
  static createPaymentUrl(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: 'Return url success',
        data: PaymentService.createPaymentUrl(req.body.amount as number)
      });
    } catch (err) {
      next(err);
    }
  }

  static verifySuccessUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const isSuccess = PaymentService.verifySuccessUrl(req.body.url as string);
      return res.status(isSuccess ? 200 : 400).json({
        message: isSuccess ? 'Valid url' : 'Invalid url'
      });
    } catch (err) {
      next(err);
    }
  }
}
