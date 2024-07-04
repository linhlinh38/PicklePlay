import express from 'express';
import StaffController from '../controllers/staff.controller';

const router = express.Router();
router.get('/', StaffController.getAll);
router.get('/my-branch', StaffController.getMyBranch);
router.get('/:id', StaffController.getById);
router.post('/', StaffController.create);
router.put('/:id', StaffController.update);
router.delete('/:id', StaffController.delete);
export default router;
