export interface ITransaction {
  amount: number;
  from?: string;
  to?: string;
  type: string;
  payment?: string;
  paymentMethod: string;
}
