import express from 'express';
import validate from '../utils/validate';
import PackageCourtController from '../controllers/packageCourt.controller';
import { createPackageCourtSchema } from '../models/validateSchema/createPackageCourt.validate.schema';

const router = express.Router();
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
