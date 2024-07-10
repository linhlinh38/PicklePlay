import express from 'express';
import authentication from '../middlewares/authentication';
import customerController from '../controllers/customer.controller';
import validate from '../utils/validate';
import { createUserSchema } from '../models/validateSchema/createUser.validate.schema';
import { updateUserSchema } from '../models/validateSchema/updateUser.validate.schema';
import { Author } from '../middlewares/authorization';
import { RoleEnum } from '../utils/enums';

const customerRoute = express.Router();
customerRoute.post(
  '/create',
  validate(createUserSchema),
  customerController.createCustomer
);

customerRoute.use(authentication);
customerRoute.get('/', customerController.getCustomerInfo);
customerRoute.get(
  '/:id',
  Author([RoleEnum.ADMIN, RoleEnum.OPERATOR]),
  customerController.getCustomerById
);
customerRoute.put(
  '/',
  validate(updateUserSchema),
  customerController.updateCustomer
);

export default customerRoute;
