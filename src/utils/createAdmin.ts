import { IUser } from '../interfaces/user.interface';
import adminModel from '../models/admin.model';
import { RoleEnum, UserStatusEnum } from './enums';

export const createAdmin = async () => {
  const userDTO: Partial<IUser> = {
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin',
    role: RoleEnum.ADMIN,
    gender: 'Male',
    firstName: 'admin',
    status: UserStatusEnum.ACTIVE
  };
  const existAdmin = await adminModel.findOne({ username: userDTO.username });
  if (!existAdmin) await adminModel.create(userDTO);
};
