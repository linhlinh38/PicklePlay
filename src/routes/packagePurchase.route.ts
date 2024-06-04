import express from 'express';
import PackagePurchaseController from '../controllers/packagePurchase.controller';

const router = express.Router();
// router.use(auth);
router.get('/', PackagePurchaseController.getAll);
router.get(
  '/get-purchases/:managerId',
  PackagePurchaseController.getPurchasesOfManager
);
router.get('/:id', PackagePurchaseController.getById);
router.post('/buy-package', PackagePurchaseController.buyPackageCourt);

export default router;
