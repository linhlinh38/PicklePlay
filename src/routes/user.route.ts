import express from 'express';
import authentication from '../middlewares/authentication';
import userController from '../controllers/user.controller';
import validate from '../utils/validate';
import { createUserSchema } from '../models/validateSchema/createUser.validate.schema';
import { Author } from '../middlewares/authorization';
import { RoleEnum } from '../utils/enums';
import { updateUserSchema } from '../models/validateSchema/updateUser.validate.schema';

const userRoute = express.Router();
userRoute.use(authentication);
userRoute.get('/', userController.getAllUsers);
userRoute.get(
  '/get/:role',
  Author([RoleEnum.ADMIN, RoleEnum.OPERATOR]),
  userController.getAllUsersByRole
);
userRoute.post(
  '/deactive',
  Author([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.OPERATOR]),
  userController.deActiveAccount
);
userRoute.post(
  '/create',
  validate(createUserSchema),
  userController.createUser
);
userRoute.put(
  '/update/:id',
  validate(updateUserSchema),
  userController.updateUser
);
userRoute.post('/reset-password', userController.resetPassword);
userRoute.post(
  '/create',
  validate(createUserSchema),
  userController.createUser
);

export default userRoute;
