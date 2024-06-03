export interface IBranch {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  images?: string[];
  license: string;
  totalCourt: number;
  slotDuration: number;
  description: string;
  availableTimes: string[];
  status?: string;
  manager?: string;
}
