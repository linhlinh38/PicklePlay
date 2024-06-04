import { EmailAlreadyExistError } from '../errors/emailAlreadyExistError';
import { NotFoundError } from '../errors/notFound';
import { IUser } from '../interfaces/user.interface';
import userModel from '../models/user.model';
import { encryptedPassword } from '../utils/jwt';
import { BaseService } from './base.service';

class UserService extends BaseService<IUser> {
  constructor() {
    super(userModel);
  }

  async beforeCreate(data: IUser): Promise<void> {
    const key: Partial<IUser> = { email: data.email };
    const user = await this.search(key);
    if (user.length !== 0) {
      throw new EmailAlreadyExistError();
    }
    data.password = await encryptedPassword(data.password);
  }

  async beforeUpdate(id: string, data: IUser): Promise<void> {
    const user = await this.getById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
  }
}

export const userService = new UserService();
