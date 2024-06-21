import express from 'express';
import authController from '../controllers/auth.controller';
import authentication from '../middlewares/authentication';
import validate from '../utils/validate';
import { loginSchema } from '../models/validateSchema/login.validate.schema';

const authRoute = express.Router();
authRoute.post('/login', validate(loginSchema), authController.login);
authRoute.use(authentication);
authRoute.post('/refresh', authController.refreshToken);
authRoute.get('/me', authController.getProfile);
export default authRoute;
