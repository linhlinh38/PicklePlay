import { NextFunction, Request, Response } from "express";
import { DatabaseError, ServerError } from "../utils/error";
import { userService } from "../services/user.service";
import { IUser } from "../interfaces/user.interface";

async function createUser(req: Request, res: Response, next: NextFunction) {
  const newUser: IUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    gender: req.body.gender,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
  };
  try {
    const key: Partial<IUser> = { email: req.body.email };
    const user = await userService.search(key);
    if (user.length !== 0) {
      return res.status(400).json({ message: "Email already exists!" });
    }
    newUser.password = userService.encryptedPassword(req.body.password);
    await userService.create(newUser);
    return res.status(201).json({ message: "Created User Successfully" });
  } catch (error: any) {
    if (error instanceof ServerError) {
      return res.status(500).json({ message: error.message });
    } else if (error instanceof DatabaseError) {
      return res.status(503).json({ message: error.message });
    } else {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}

async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getAll();
    return res.status(200).json({ userList: user });
  } catch (error: any) {
    if (error instanceof DatabaseError) {
      return res.status(503).json({ message: error.message });
    } else {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
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
    if (error instanceof DatabaseError) {
      return res.status(503).json({ message: error.message });
    } else {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
};

export default {
  createUser,
  getUserByIdHandler,
  getAllUsers,
};
