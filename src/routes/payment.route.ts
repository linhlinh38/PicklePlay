import express from 'express';
import PaymentController from '../controllers/payment.controller';

const router = express.Router();
router.post('/create-payment-url', PaymentController.createPaymentUrl);
router.post('/verify-success-url', PaymentController.verifySuccessUrl);
export default router;
