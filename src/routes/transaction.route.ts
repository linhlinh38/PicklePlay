import express from 'express';
import TransactionController from '../controllers/transaction.controller';

const router = express.Router();
router.get('/get-of-user/:userId', TransactionController.getOfUser);
router.post('/create', TransactionController.create);
router.get('/get-by-id/:id', TransactionController.getById);
export default router;
