import express from 'express';
import validate from '../utils/validate';
import { updateManagerSchema } from '../models/validateSchema/updateManager.validate.schema';
import OperatorController from '../controllers/operator.controller';
import { createUserSchema } from '../models/validateSchema/createUser.validate.schema';

const router = express.Router();
router.get('/', OperatorController.getAll);
router.get('/:id', OperatorController.getById);
router.post('/', validate(createUserSchema), OperatorController.create);
router.put('/:id', validate(updateManagerSchema), OperatorController.update);
router.delete('/:id', OperatorController.delete);
export default router;
