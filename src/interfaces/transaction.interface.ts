export interface ITransaction {
  amount: number;
  from?: string;
  to?: string;
  content: string;
  type: string;
  payment?: string;
  paymentMethod: string;
}
