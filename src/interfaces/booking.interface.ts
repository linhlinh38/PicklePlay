export interface IBooking {
  type: string;
  paymentType: string;
  paymentMethod: string;
  totalPrice: number;
  totalHour: string;
  startDate: string;
  endDate: string;
  status: string;
  customer?: string;
  manager?: string;
}
