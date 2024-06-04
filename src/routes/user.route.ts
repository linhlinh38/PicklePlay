import express from 'express';
import authentication from '../middlewares/authentication';
import userController from '../controllers/user.controller';
import validate from '../utils/validate';
import { createUserSchema } from '../models/validateSchema/createUser.validate.schema';

const userRoute = express.Router();
userRoute.use(authentication);
userRoute.get('/', userController.getAllUsers);
userRoute.post(
  '/create',
  validate(createUserSchema),
  userController.createUser
);

export default userRoute;
