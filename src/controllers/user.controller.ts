import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { NotFoundError } from '../errors/notFound';

async function createUser(req: Request, res: Response, next: NextFunction) {
  const newUser: IUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    gender: req.body.gender,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone
  };
  try {
    const key: Partial<IUser> = { email: req.body.email };
    const user = await userService.search(key);
    if (user.length !== 0) {
      throw new NotFoundError('Email already exists!');
    }
    newUser.password = await userService.encryptedPassword(req.body.password);
    await userService.create(newUser);
    return res.status(201).json({ message: 'Created User Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req: Request, res: Response) {
  const user = await userService.getAll();
  return res.status(200).json({ userList: user });
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
