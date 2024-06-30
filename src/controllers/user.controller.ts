import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { NotFoundError } from '../errors/notFound';
import { encryptedPassword } from '../utils/jwt';
import { UserStatusEnum } from '../utils/enums';

async function createUser(req: Request, res: Response, next: NextFunction) {
  const newUser: IUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    gender: req.body.gender,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    dob: req.body.date,
    status: UserStatusEnum.ACTIVE
  };
  try {
    await userService.create(newUser);
    return res.status(201).json({ message: 'Created User Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req: Request, res: Response) {
  const user = await userService.getAll();
  return res.status(200).json({ data: user });
}
const getUserByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getById(req.params.id);
    return res.status(200).json({ user: user });
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  getUserByIdHandler,
  getAllUsers
};
