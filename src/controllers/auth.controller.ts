import { NextFunction, Request, Response } from 'express';
import { config } from '../config/envConfig';
import { verifyToken } from '../utils/jwt';
import { userService } from '../services/user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as authService from '../services/auth.service';

const { SECRET_KEY_FOR_ACCESS_TOKEN, SECRET_KEY_FOR_REFRESH_TOKEN } = config;

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const loginResult = await authService.login(email, password);
    if (loginResult) {
      res.setHeader('Authorization', `Bearer ${loginResult.token}`);
      res.status(200).json({
        message: 'Login successful',
        data: {
          accessToken: loginResult.token,
          refreshToken: loginResult.refreshToken
        }
      });
    } else {
      res.status(500).json({
        message: 'Server Error'
      });
    }
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Missing refresh token' });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      SECRET_KEY_FOR_REFRESH_TOKEN
    ) as JwtPayload;
    const userId = decoded.userId;

    const user = await userService.getById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ userId }, SECRET_KEY_FOR_ACCESS_TOKEN, {
      expiresIn: '1d'
    });
    res.status(200).json({
      message: 'Refresh token Successful',
      data: { accessToken: newAccessToken }
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    const accessToken = authorization.split(' ')[1];
    const { payload } = verifyToken(accessToken);
    const user = await userService.getById(payload.userId);
    return res
      .status(200)
      .json({ message: 'Get Profile successful', data: user });
  } catch (error) {
    next(error);
  }
};

export default { login, getProfile, refreshToken };
