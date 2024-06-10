import { IManager } from './../interfaces/manager.interface';
import managerModel from '../models/manager.model';
import { BaseService } from './base.service';
import { IPayment } from '../interfaces/payment.interface';
import paymentModel from '../models/payment.model';
import { EmailAlreadyExistError } from '../errors/emailAlreadyExistError';
import bcrypt from 'bcrypt';
import { userService } from './user.service';

class ManagerService extends BaseService<IManager> {
  constructor() {
    super(managerModel);
  }

  encryptedPassword = async function (password: string) {
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  async createManager(managerDTO: IManager) {
    const emailUserExist = await userService.search({
      email: managerDTO.email
    });

    if (emailUserExist.length > 0) throw new EmailAlreadyExistError();

    const payments: [IPayment] = [...managerDTO.payments];
    delete managerDTO.payments;
    managerDTO.password = await this.encryptedPassword(managerDTO.password);
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
