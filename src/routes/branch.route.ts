import express from 'express';
import auth from '../middlewares/auth';
import validate from '../utils/validate';
import PackageCourtController from '../controllers/packageCourt.controller';
import { createPackageCourtSchema } from '../models/validateSchema/createPackageCourt.validate.schema';

const router = express.Router();
// router.use(auth);
router.get('/', PackageCourtController.getAll);
router.get('/:id', PackageCourtController.getById);
router.post(
  '/',
  validate(createPackageCourtSchema),
  PackageCourtController.create
);
router.put('/:id', PackageCourtController.update);
router.delete('/:id', PackageCourtController.delete);

export default router;
