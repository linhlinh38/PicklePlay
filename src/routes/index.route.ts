import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import managerRoute from './manager.route';
import packageCourtRoute from './packageCourt.route';
import packagePurchaseRoute from './packagePurchase.route';

const indexRoute = express.Router();

indexRoute.use('/user', userRoute);
indexRoute.use('/auth', authRoute);
indexRoute.use('/manager', managerRoute);
indexRoute.use('/package-court', packageCourtRoute);
indexRoute.use('/package-purchase', packagePurchaseRoute);

export default indexRoute;
