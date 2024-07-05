import express from 'express';
import validate from '../utils/validate';
import PackageCourtController from '../controllers/packageCourt.controller';
import { createPackageCourtSchema } from '../models/validateSchema/createPackageCourt.validate.schema';
import { Author } from '../middlewares/authorization';
import { RoleEnum } from '../utils/enums';
import authentication from '../middlewares/authentication';
import { parseToken } from '../middlewares/parseToken';

const router = express.Router();
router.get('/', parseToken, PackageCourtController.getAll);
router.get('/:id', PackageCourtController.getById);
router.post(
  '/',
  authentication,
  Author([RoleEnum.ADMIN]),
  validate(createPackageCourtSchema),
  PackageCourtController.create
);
router.put('/:id', PackageCourtController.update);
router.delete('/:id', PackageCourtController.delete);

export default router;
