import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { NotFoundError } from '../errors/notFound';
import { encryptedPassword } from '../utils/jwt';
import {
  BookingStatusEnum,
  BranchStatusEnum,
  CourtStatusEnum,
  RoleEnum,
  UserStatusEnum
} from '../utils/enums';
import { branchService } from '../services/branch.service';
import { courtService } from '../services/court.service';
import { bookingService } from '../services/booking.service';
import { scheduleService } from '../services/schedule.service';
import { AuthRequest } from '../middlewares/authentication';
import { BadRequestError } from '../errors/badRequestError';
import bcrypt from 'bcrypt';

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

async function updateUser(req: Request, res: Response, next: NextFunction) {
  const updateUser: Partial<IUser> = req.body;
  try {
    await userService.update(req.params.id, updateUser);
    return res.status(201).json({ message: 'Update User Successfully' });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const oldPassword: string = req.body.oldPassword;
  const user = await userService.getById(req.loginUser);
  if (!user) {
    return res.status(400).json({ message: 'User not found!' });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid old password' });
  }
  const newPassword = await encryptedPassword(req.body.newPassword);
  try {
    await userService.update(req.loginUser, { password: newPassword });
    return res.status(201).json({ message: 'Update Password Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req: Request, res: Response) {
  const user = await userService.getAll();
  return res.status(200).json({ data: user });
}
async function getAllUsersByRole(req: Request, res: Response) {
  const user = await userService.search({ role: req.params.role });
  return res.status(200).json({ data: user });
}

async function deActiveAccount(req: Request, res: Response) {
  const user = await userService.update(req.body.id, {
    status: UserStatusEnum.INACTIVE
  });
  if (user.role === RoleEnum.MANAGER) {
    const branchs = await branchService.search({ manager: user._id });
    if (branchs.length > 0) {
      branchs.map(async (branch) => {
        await Promise.all([
          courtService.updateManyCourts(
            branch._id,
            CourtStatusEnum.TERMINATION
          ),
          branchService.update(branch._id, {
            status: BranchStatusEnum.INACTIVE
          })
        ]);
      });
    }
  }
  if (user.role === RoleEnum.CUSTOMER) {
    const bookings = await bookingService.search({
      customer: user._id,
      status: BookingStatusEnum.BOOKED
    });
    if (bookings.length > 0) {
      bookings.map(async (booking) => {
        bookingService.update(booking._id, {
          status: BookingStatusEnum.CANCELLED
        });

        const schedules = await scheduleService.search({
          booking: booking._id
        });
        if (schedules.length > 0) {
          schedules.map(async (schedule) => {
            return await scheduleService.delete(schedule._id);
          });
        }
      });
    }
  }
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
  getAllUsers,
  getAllUsersByRole,
  deActiveAccount,
  updateUser,
  resetPassword
};
