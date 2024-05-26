import express from 'express';

import validate from '../utils/validate';
import { createUserSchema } from '../models/validateSchema/createUser.validate.schema';
import customerController from '../controllers/customer.controller';
import { GenderEnum } from '../utils/enums';

const router = express.Router();
router.post('/create',validate(createUserSchema), customerController.createCustomer);

export default router;
