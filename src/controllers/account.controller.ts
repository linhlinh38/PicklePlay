import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import accountService from "../services/account.service";
import { DatabaseError, ServerError } from "../utils/error";

async function createAccount(req: Request, res: Response, next: NextFunction) {
  const { username, email, role, password } = req.body;
  try {
    const account = await accountService.findUserByUsernameOrEmail(
      username,
      email
    );
    if (account.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists!" });
    }
    await accountService.createAccount(username, email, role, password);
    return res.status(201).json({ message: "Created Account Successfully" });
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

async function getAllAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await accountService.getAllAccount();
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

export default {
  createAccount,
  getAllAccount,
};
