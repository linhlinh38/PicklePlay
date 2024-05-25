import { NextFunction, Request, Response } from "express";
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/envConfig";

interface AuthRequest extends express.Request {
  userId?: string;
}

function isJwtPayload(decoded: string | JwtPayload): decoded is JwtPayload {
  return typeof decoded !== "string";
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // Extract token from 'Bearer token' format
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { secretKey } = config;

    const decoded = jwt.verify(token, secretKey);

    if (isJwtPayload(decoded)) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
export default verifyToken;
