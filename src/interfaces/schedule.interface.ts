import { IBooking } from './booking.interface';
import { ICourt } from './court.interface';

export interface ISchedule {
  type: string;
  slot: string;
  date: string;
  booking: string | IBooking;
  court: string | ICourt;
  status: string;
}
