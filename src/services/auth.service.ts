import { BadRequestError } from '../errors/badRequestError';
import userModel from '../models/user.model';
import bcrypt from 'bcrypt';
import { UserStatusEnum } from '../utils/enums';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/envConfig';
import { generateRefreshToken } from '../utils/jwt';

const { SECRET_KEY_FOR_ACCESS_TOKEN, SECRET_KEY_FOR_REFRESH_TOKEN } = config;

export async function login(email: string, password: string) {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new BadRequestError('Invalid email');
  }

  if (user.password.length > 0) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError('Invalid password');
    }
  } else {
    throw new BadRequestError('User must login by google');
  }

  if (user.status === UserStatusEnum.INACTIVE) {
    throw new BadRequestError('Account is INACTIVE');
  }

  const payload = { userId: user.id.toString() };

  const token = jwt.sign(payload, SECRET_KEY_FOR_ACCESS_TOKEN, {
    expiresIn: '1d'
  });
  const refreshToken = generateRefreshToken(user.id.toString());

  return { token, refreshToken };
}
