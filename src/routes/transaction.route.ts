import express from 'express';
import TransactionController from '../controllers/transaction.controller';
import authentication from '../middlewares/authentication';

const router = express.Router();
router.get(
  '/get-my-transactions',
  authentication,
  TransactionController.getMyTransactions
);
router.post('/create', TransactionController.create);
router.get('/get-by-id/:id', TransactionController.getById);
export default router;
