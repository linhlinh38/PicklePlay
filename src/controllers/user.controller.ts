import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { DatabaseError, ServerError } from "../utils/error";

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, email, role, password, gender } = req.body;
  try {
    const user = await userService.findUserByUsernameOrEmail(username, email);
    if (user.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists!" });
    }
    await userService.createUser(username, email, role, password, gender);
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
    const user = await userService.getAllUsers();
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
    const user = await userService.getUserById(req.params.id);
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
