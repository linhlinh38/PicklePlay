import express from 'express';
import PackagePurchaseController from '../controllers/packagePurchase.controller';
import validate from '../utils/validate';
import { buyPackagePurchaseSchema } from '../models/validateSchema/buyPackage.validate.schema';
import authentication from '../middlewares/authentication';
import { RoleEnum } from '../utils/enums';
import { Author } from '../middlewares/authorization';

const router = express.Router();
// router.use(auth);
router.get('/', PackagePurchaseController.getAll);
router.get(
  '/get-my-purchases',
  authentication,
  Author([RoleEnum.MANAGER]),
  PackagePurchaseController.getPurchasesOfManager
);
router.get('/:id', PackagePurchaseController.getById);
router.post(
  '/create-purchase-order',
  PackagePurchaseController.buyPackageCourt
);
router.post(
  '/buy-package-full',
  authentication,
  Author([RoleEnum.MANAGER]),
  validate(buyPackagePurchaseSchema),
  PackagePurchaseController.buyPackageFull
);

export default router;
