import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { NotFoundError } from '../errors/notFound';
import { encryptedPassword } from '../utils/jwt';
import { RoleEnum, UserStatusEnum } from '../utils/enums';
import { customerService } from '../services/customer.service';
import { AuthRequest } from '../middlewares/authentication';
import { EmailAlreadyExistError } from '../errors/emailAlreadyExistError';

async function createCustomer(req: Request, res: Response, next: NextFunction) {
  const newCustomer: IUser = {
    username: req.body.username ?? '',
    email: req.body.email,
    password: req.body.password,
    role: RoleEnum.CUSTOMER,
    gender: req.body.gender ?? '',
    firstName: req.body.firstName ?? '',
    lastName: req.body.lastName ?? '',
    phone: req.body.phone ?? '',
    dob: req.body.dob ?? '',
    status: UserStatusEnum.ACTIVE
  };
  try {
    const key: Partial<IUser> = {
      email: req.body.email
    };
    const customer = await userService.search(key);

    if (customer.length !== 0) {
      throw new EmailAlreadyExistError('Email already exists!');
    }
    if (newCustomer.password) {
      newCustomer.password = await encryptedPassword(req.body.password);
    }

    await customerService.create(newCustomer);
    return res.status(201).json({ message: 'Created Customer Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllCustomers(req: Request, res: Response) {
  const customer = await customerService.getAll();
  return res
    .status(200)
    .json({ message: 'Get Customer Successfully', data: customer });
}

async function getCustomerInfo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const customer = await customerService.getById(req.loginUser);
    return res
      .status(200)
      .json({ message: 'Get Customer Successfully', data: customer });
  } catch (error) {
    next(error);
  }
}

async function getCustomerById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const customer = await customerService.getById(req.params.id);
    return res
      .status(200)
      .json({ message: 'Get Customer Successfully', data: customer });
  } catch (error) {
    next(error);
  }
}

async function updateCustomer(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.loginUser as string;
    const updateData = req.body as Partial<IUser>;
    const customer = await customerService.update(id, updateData);
    if (!customer) throw new NotFoundError('Customer not found');
    return res
      .status(200)
      .json({ message: 'Update Customer Successfully', data: customer });
  } catch (error) {
    next(error);
  }
}
export default {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerInfo,
  updateCustomer
};
