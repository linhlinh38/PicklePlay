import { IManager } from './../interfaces/manager.interface';
import managerModel from '../models/manager.model';
import { BaseService } from './base.service';
import { IPayment } from '../interfaces/payment.interface';
import Logging from '../utils/logging';
import paymentModel from '../models/payment.model';
import { EmailAlreadyExistError } from '../errors/emailAlreadyExistError';

class ManagerService extends BaseService<IManager> {
  constructor() {
    super(managerModel);
  }

  async createManager(managerDTO: IManager) {
    const emailUserExist = await this.search({ email: managerDTO.email });
    if (emailUserExist) throw new EmailAlreadyExistError();

    const payments: [IPayment] = [...managerDTO.payments];
    delete managerDTO.payments;
    const savedManager = await this.model.create(managerDTO);

    if (payments != null && payments.length > 0) {
      const paymentDatas = payments.map((payment) => {
        return { ...payment, owner: savedManager._id };
      });
      const savedPayments = await paymentModel.insertMany(paymentDatas);
      savedManager.payments = savedPayments.map((payment) => payment._id);
      await savedManager.save();
    }

    return savedManager;
  }
}

export const managerService = new ManagerService();
