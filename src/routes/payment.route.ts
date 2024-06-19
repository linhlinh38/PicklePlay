import express from 'express';
import PaymentController from '../controllers/payment.controller';
import authentication from '../middlewares/authentication';

const router = express.Router();
router.post('/create-payment-url', PaymentController.createPaymentUrl);
router.post('/verify-success-url', PaymentController.verifySuccessUrl);
router.post('/add', authentication, PaymentController.addPayment);
export default router;
