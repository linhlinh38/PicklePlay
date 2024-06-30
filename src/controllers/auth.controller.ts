import { NextFunction, Request, Response } from 'express';
import userModel from '../models/user.model';
import { config } from '../config/envConfig';
import { generateRefreshToken, verifyToken } from '../utils/jwt';
import { userService } from '../services/user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserStatusEnum } from '../utils/enums';
import { OAuth2Client } from 'google-auth-library';
import { BadRequestError } from '../errors/badRequestError';
import * as authService from '../services/auth.service';

const { SECRET_KEY_FOR_ACCESS_TOKEN, SECRET_KEY_FOR_REFRESH_TOKEN } = config;

async function loginGoogle(req: Request, res: Response, next: NextFunction) {
  const { credential } = req.body;
  let payload;
  try {
    const client = new OAuth2Client(config.GG_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.GG_CLIENT_ID
    });
    payload = ticket.getPayload();
  } catch (err) {
    console.log(err);
    next(new BadRequestError('Account not found'));
  }

  try {
    const email = payload.email;
    const user = await userModel.findOne({ email });
    if (!user) throw new BadRequestError('Account not found');
    if (user.status == UserStatusEnum.INACTIVE) {
      throw new BadRequestError('Account is inactive');
    }
    const payload1 = { userId: user.id.toString() };

    const token = jwt.sign(payload1, SECRET_KEY_FOR_ACCESS_TOKEN, {
      expiresIn: '1h'
    });
    const refreshToken = generateRefreshToken(user.id.toString());

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      message: 'Login successful',
      accessToken: token,
      refreshToken: refreshToken
    });
  } catch (err) {
    next(err);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const loginResult = await authService.login(email, password);
    if (loginResult) {
      res.setHeader('Authorization', `Bearer ${loginResult.token}`);
      res.status(200).json({
        message: 'Login successful',
        accessToken: loginResult.token,
        refreshToken: loginResult.refreshToken
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
      expiresIn: '1h'
    });
    res.status(200).json({ accessToken: newAccessToken });
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
    return res.status(200).json({ user: user });
  } catch (error) {
    next(error);
  }
};

export default { login, getProfile, refreshToken, loginGoogle };
