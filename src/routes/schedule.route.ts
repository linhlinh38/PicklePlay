import express from 'express';
import scheduleController from '../controllers/schedule.controller';
import authentication from '../middlewares/authentication';
import validate from '../utils/validate';
import { createScheduleSchema } from '../models/validateSchema/createSchedule.validate.schema';

const scheduleRouter = express.Router();
scheduleRouter.use(authentication);
scheduleRouter.post(
  '/',
  validate(createScheduleSchema),
  scheduleController.createSchedule
);
scheduleRouter.get('/', scheduleController.getScheduleOfCustomer);
scheduleRouter.get('/customer', scheduleController.getAllScheduleCustomer);
scheduleRouter.get(
  '/GetScheduleByCourt/:court',
  scheduleController.getScheduleByCourt
);
scheduleRouter.get(
  '/GetScheduleByBooking/:booking',
  scheduleController.getScheduleByBooking
);
scheduleRouter.post('/update/:id', scheduleController.updateSchedule);
scheduleRouter.post('/cancel/:id', scheduleController.cancelSchedule);
scheduleRouter.post(
  '/permanent',
  scheduleController.calculatePermanentSchedule
);
export default scheduleRouter;
