import express from 'express';
import StaffController from '../controllers/staff.controller';
import authentication from '../middlewares/authentication';
import { Author } from '../middlewares/authorization';
import { RoleEnum } from '../utils/enums';

const router = express.Router();
router.get('/', StaffController.getAll);
router.get('/my-branch', StaffController.getMyBranch);
router.use(authentication);
router.get('/:id', StaffController.getById);
router.post(
  '/',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  StaffController.create
);
router.get('/get-by-branch/:branch', StaffController.getByBranch);
router.put('/:id', StaffController.update);
router.delete('/:id', StaffController.delete);
export default router;
