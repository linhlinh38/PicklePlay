import { Response, NextFunction } from 'express';

import { AuthRequest } from './authentication';
import { userService } from '../services/user.service';

export const Author = (roles: Array<string>) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = req.loginUser;

    let user;
    try {
      user = await userService.getById(id);
    } catch (error) {
      next(error);
    }

    if (!user) return res.status(401).json({ message: 'Invalid User' });

    if (roles.indexOf(user.role) > -1) next();
    else
      return res
        .status(401)
        .json({ message: `Unauthorization. This is page for ${roles}` });
  };
};
