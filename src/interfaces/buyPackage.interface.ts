export interface IBuyPackage {
  packageId: string;
  managerId: string;
  duration: number;
  totalCourt: number;
  paymentId?: string;
  description?: string;
  orderCode?: string;
  returnUrl?: string;
  cancelUrl?: string;
}
