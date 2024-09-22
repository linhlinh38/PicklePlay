import express from 'express';
import PaymentController from '../controllers/payment.controller';
import authentication from '../middlewares/authentication';
import validate from '../utils/validate';
import { paymentSchema } from '../models/validateSchema/payment.validate.schema';

const router = express.Router();
router.post(
  '/create-payment-url',
  authentication,
  PaymentController.createPaymentUrl
);
router.post(
  '/create-payment-url-for-booking',
  authentication,
  PaymentController.createPaymentUrlForBooking
);
router.post('/verify-success-url', PaymentController.verifySuccessUrl);
router.post(
  '/add',
  authentication,
  validate(paymentSchema),
  PaymentController.addPayment
);
router.get('/get-my-payments', authentication, PaymentController.getMyPayments);
router.delete('/:id', authentication, PaymentController.deletePayment);
export default router;
