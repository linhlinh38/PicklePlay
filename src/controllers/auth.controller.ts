import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import { config } from "../config/envConfig";
import { verifyToken } from "../utils/jwt";
import userService from "../services/user.service";
import { DatabaseError } from "../utils/error";
import jwt from "jsonwebtoken";

var bcrypt = require("bcrypt");
// var jwt = require("jsonwebtoken");
const { secretKey } = config;
async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = { userId: user.id.toString() };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Login successful", accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const getProfile = async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization;
    console.log(authorization);
    const accessToken = authorization.split(" ")[1];
    const { payload } = verifyToken(accessToken);
    const user = await userService.getUserById(payload.userId);
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

export default { login, getProfile };
