export interface IBooking {
  _id?: string;
  type: string;
  paymentType: string;
  paymentMethod: string;
  totalPrice: number;
  totalHour: string;
  startDate: string;
  endDate: string;
  status: string;
  customer?: string;
}
