import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { AuthRequest } from './authentication';
import { config } from '../config/envConfig';

const { SECRET_KEY_FOR_ACCESS_TOKEN } = config;

function isJwtPayload(decoded: string | JwtPayload): decoded is JwtPayload {
  return typeof decoded !== 'string';
}
export const parseToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  // Extract token from 'Bearer token' format
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY_FOR_ACCESS_TOKEN);
    if (isJwtPayload(decoded)) {
      req.loginUser = decoded.userId;
      return next();
    }
  } catch (error) {
    return next();
  }
};
