export interface IPayment {
  accountNumber: string;
  accountName: string;
  accountBank?: string;
  expDate?: Date;
  owner?: string;
}
