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

  // async getById(id: string): Promise<IUser> {
  //   try {
  //     const user = await userModel
  //       .findById(id)
  //       .select("id username first_name last_name email role gender phone");

  //     return user;
  //   } catch (error) {
  //     throw new DatabaseError("Database error: " + error.message);
  //   }
  // }
}

export const userService = new UserService();
