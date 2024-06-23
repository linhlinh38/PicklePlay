import express from 'express';
import authController from '../controllers/auth.controller';
import authentication from '../middlewares/authentication';

const authRoute = express.Router();
authRoute.post('/login', authController.login);
authRoute.post('/login-google', authController.loginGoogle);
authRoute.use(authentication);
authRoute.post('/refresh', authController.refreshToken);
authRoute.get('/me', authController.getProfile);
export default authRoute;
