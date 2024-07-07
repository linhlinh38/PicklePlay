import express from 'express';
import PaymentController from '../controllers/payment.controller';
import authentication from '../middlewares/authentication';

const router = express.Router();
router.post('/create-payment-url', PaymentController.createPaymentUrl);
router.post('/verify-success-url', PaymentController.verifySuccessUrl);
router.post('/add', authentication, PaymentController.addPayment);
router.get('/get-my-payments', authentication, PaymentController.getMyPayments);
router.delete('/:id', authentication, PaymentController.deletePayment);
export default router;
