import jwt, { VerifyOptions, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { config } from '../config/envConfig';
const { SECRET_KEY_FOR_ACCESS_TOKEN, SECRET_KEY_FOR_REFRESH_TOKEN } = config;
const ACCESS_TOKEN_EXP = '15m';
export const REFRESH_TOKEN_EXP = '30d';

export function generateRefreshToken(userId: string) {
  const payload = { userId: userId };
  const refreshToken = jwt.sign(payload, SECRET_KEY_FOR_REFRESH_TOKEN, {
    expiresIn: '7d'
  });
  return refreshToken;
}

export async function encryptedPassword(password: string) {
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export type AccessToken = {
  userId: string;
  //   sessionId: SessionDocument["_id"];
};

export const signToken = (
  payload: any,
  options?: SignOptions & {
    secret?: string;
  }
) => {
  const { secret = SECRET_KEY_FOR_ACCESS_TOKEN, ...opts } = options || {};
  return jwt.sign(payload, secret, {
    audience: 'minh',
    expiresIn: ACCESS_TOKEN_EXP,
    ...opts
  });
};

export const verifyToken = <T extends object = AccessToken>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  }
) => {
  const { secret = SECRET_KEY_FOR_ACCESS_TOKEN, ...opts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      //   audience: ,
      ...opts
    }) as T;
    return {
      payload
    };
  } catch (error: any) {
    return {
      error: error.message
    };
  }
};
