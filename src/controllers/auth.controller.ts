import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";

var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

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
    const secretKey = "gialinh123";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Login successful", accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export default { login };
