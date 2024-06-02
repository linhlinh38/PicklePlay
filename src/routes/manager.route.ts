import express from 'express';
import auth from '../middlewares/auth';
import validate from '../utils/validate';
import { createManagerSchema } from '../models/validateSchema/createManager.validate.schema';
import ManagerController from '../controllers/manager.controller';
import { updateManagerSchema } from '../models/validateSchema/updateManager.validate.schema';

const router = express.Router();
// router.use(auth);
router.get('/', ManagerController.getAll);
router.get('/:id', ManagerController.getById);
router.post('/', validate(createManagerSchema), ManagerController.create);
router.put('/:id', validate(updateManagerSchema), ManagerController.update);
router.delete('/:id', ManagerController.delete);

export default router;
