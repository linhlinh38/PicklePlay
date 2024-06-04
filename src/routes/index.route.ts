import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import customerRoute from './customer.route';
import courtRoute from './court.route';

const router = express.Router();
router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/customer', customerRoute);
router.use('/court', courtRoute);

export default router;
