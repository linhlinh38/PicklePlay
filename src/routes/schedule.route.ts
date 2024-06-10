import express from 'express';
import scheduleController from '../controllers/schedule.controller';
import authentication from '../middlewares/authentication';

const scheduleRouter = express.Router();
scheduleRouter.use(authentication);
scheduleRouter.post('/', scheduleController.createSchedule);
scheduleRouter.get('/', scheduleController.getScheduleOfCustomer);
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
export default scheduleRouter;
