import express from 'express';
import authentication from '../middlewares/authentication';
import userController from '../controllers/user.controller';
import validate from '../utils/validate';
import { createUserSchema } from '../models/validateSchema/createUser.validate.schema';
import { Author } from '../middlewares/authorization';
import { RoleEnum } from '../utils/enums';

const userRoute = express.Router();
userRoute.use(authentication);
userRoute.get('/', userController.getAllUsers);
userRoute.get(
  '/get/:role',
  Author([RoleEnum.ADMIN]),
  userController.getAllUsersByRole
);
userRoute.post(
  '/deactive',
  Author([RoleEnum.ADMIN, RoleEnum.MANAGER]),
  userController.deActiveAccount
);
userRoute.post(
  '/create',
  validate(createUserSchema),
  userController.createUser
);

export default userRoute;
