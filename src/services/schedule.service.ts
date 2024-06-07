import { IBooking } from '../interfaces/booking.interface';
import { ISchedule } from '../interfaces/schedule.interface';
import scheduleModel from '../models/schedule.model';
import { BaseService } from './base.service';

class ScheduleService extends BaseService<ISchedule> {
  constructor() {
    super(scheduleModel);
  }

  async beforeCreate(data: ISchedule): Promise<void> {}
}

export const scheduleService = new ScheduleService();
