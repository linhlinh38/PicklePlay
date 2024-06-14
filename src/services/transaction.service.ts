import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import branchModel from '../models/branch.model';
import { userService } from './user.service';
import { ITransaction } from '../interfaces/transaction.interface';
import transactionModel from '../models/transaction.model';

class TransactionService extends BaseService<ITransaction> {
  constructor() {
    super(branchModel);
  }
  async createTransaciton(transactionDTO: ITransaction) {
    const from = userService.getById(transactionDTO.from);
    if (!from) throw new NotFoundError('Sender not found');
    const to = userService.getById(transactionDTO.to);
    if (!to) throw new NotFoundError('Receiver not found');

    await transactionModel.create(transactionDTO);
  }
  async getOfUser(userId: string) {
    const user = userService.getById(userId);
    if (!user) throw new NotFoundError('User not found');

    const transactions = await transactionModel
      .find({
        $or: [{ from: userId }, { to: userId }]
      })
      .populate('from to');

    return transactions;
  }
}

export const transactionService = new TransactionService();
