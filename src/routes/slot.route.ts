import express from 'express';
import SlotController from '../controllers/slot.controller';

const router = express.Router();
// router.use(authentication);
router.get('/get-of-branch/:branchId', SlotController.getSlotsOfBranch);
router.post('/get-of-court-by-date', SlotController.getSlotsOfCourtByDate);
router.post('/create/:branchId', SlotController.create);
router.get('/get-by-id/:id', SlotController.getById);
router.put('/:id', SlotController.update);
router.delete('/:id', SlotController.delete);
export default router;
