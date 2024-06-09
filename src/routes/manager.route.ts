import express from 'express';
import validate from '../utils/validate';
import { createManagerSchema } from '../models/validateSchema/createManager.validate.schema';
import ManagerController from '../controllers/manager.controller';
import { updateManagerSchema } from '../models/validateSchema/updateManager.validate.schema';

const router = express.Router();
router.get('/', ManagerController.getAll);
router.get('/:id', ManagerController.getById);
router.post('/', validate(createManagerSchema), ManagerController.create);
router.put('/:id', validate(updateManagerSchema), ManagerController.update);
router.delete('/:id', ManagerController.delete);
export default router;
