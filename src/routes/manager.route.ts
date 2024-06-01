import express from 'express';
import auth from '../middlewares/auth';
import userController from '../controllers/user.controller';
import validate from '../utils/validate';
import { createManagerSchema } from '../models/validateSchema/createManager.validate.schema';
import ManagerController from '../controllers/manager.controller';

const router = express.Router();
// router.use(auth);
router.get('/', userController.getAllUsers);
router.post(
  '/create',
  validate(createManagerSchema),
  ManagerController.createManager
);

export default router;
