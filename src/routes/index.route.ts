import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import managerRoute from './manager.route';
import packageCourtRoute from './packageCourt.route';
import packagePurchaseRoute from './packagePurchase.route';
import branchRoute from './branch.route';
import customerRoute from './customer.route';
import courtRoute from './court.route';
import bookingRouter from './booking.route';
import scheduleRouter from './schedule.route';
import fileRoute from './file.route';
import staffRoute from './staff.route';
import paymentRoute from './payment.route';
import courtReportRoute from './courtReport.route';
import transactionRoute from './transaction.route';

const router = express.Router();

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/customer', customerRoute);
router.use('/court', courtRoute);
router.use('/manager', managerRoute);
router.use('/package-court', packageCourtRoute);
router.use('/package-purchase', packagePurchaseRoute);
router.use('/branch', branchRoute);
router.use('/booking', bookingRouter);
router.use('/schedule', scheduleRouter);
router.use('/file', fileRoute);
router.use('/staff', staffRoute);
router.use('/payment', paymentRoute);
router.use('/court-report', courtReportRoute);
router.use('/transaction', transactionRoute);

export default router;
