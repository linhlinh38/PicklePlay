import { EmailAlreadyExistError } from '../errors/emailAlreadyExistError';
import { IUser } from '../interfaces/user.interface';
import userModel from '../models/user.model';
import { BaseService } from './base.service';
import bcrypt from 'bcrypt';

class UserService extends BaseService<IUser> {
  constructor() {
    super(userModel);
  }

  encryptedPassword = async function (password: string) {
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  async beforeCreate(data: IUser): Promise<void> {
    const key: Partial<IUser> = { email: data.email };
    const user = await this.search(key);
    if (user.length !== 0) {
      throw new EmailAlreadyExistError();
    }
    data.password = await userService.encryptedPassword(data.password);
  }

  async beforeUpdate(id: string, data: IUser): Promise<void> {
    const key: Partial<IUser> = { email: data.email };
    const user = await this.search(key);
    if (user.length == 0) {
      throw new EmailAlreadyExistError();
    }
  }
}

export const userService = new UserService();
