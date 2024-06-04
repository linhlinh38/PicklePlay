import { IBooking } from '../interfaces/booking.interface';
import { ICourt } from '../interfaces/court.interface';
import bookingModel from '../models/booking.model';
import { BaseService } from './base.service';

class BookingService extends BaseService<IBooking> {
  constructor() {
    super(bookingModel);
  }

  async beforeCreate(data: IBooking): Promise<void> {}
}

export const bookingService = new BookingService();
