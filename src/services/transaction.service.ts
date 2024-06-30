import { BaseService } from './base.service';
import { NotFoundError } from '../errors/notFound';
import { userService } from './user.service';
import { ITransaction } from '../interfaces/transaction.interface';
import transactionModel from '../models/transaction.model';

class TransactionService extends BaseService<ITransaction> {
  constructor() {
    super(transactionModel);
  }
  async createTransaction(transactionDTO: ITransaction) {
    const from = userService.getById(transactionDTO.from);
    if (!from) throw new NotFoundError('Sender not found');
    const to = userService.getById(transactionDTO.to);
    if (!to) throw new NotFoundError('Receiver not found');

    await transactionModel.create(transactionDTO);
  }
  async getMyTransactions(userId: string) {
    const transactions = await transactionModel
      .find({
        $or: [{ from: userId }, { to: userId }]
      })
      .populate('from to');

    return transactions;
  }
}

export const transactionService = new TransactionService();
