import express from 'express';
import validate from '../utils/validate';
import BranchController from '../controllers/branch.controller';
import { createBranchSchema } from '../models/validateSchema/createBranch.validate.schema';
import { updateBranchStatusSchema } from '../models/validateSchema/updateBranchStatus.validate.schema';
import authentication from '../middlewares/authentication';
import { RoleEnum } from '../utils/enums';
import { Author } from '../middlewares/authorization';

const router = express.Router();
router.get('/', BranchController.getAll);
router.get('/get-by-id/:id', BranchController.getById);
router.post('/search', BranchController.searchByNameOrAddress);

router.get('/get-popular', BranchController.getPopularBranches);
router.use(authentication);
router.get(
  '/get-pending',
  Author([RoleEnum.ADMIN, RoleEnum.OPERATOR]),
  BranchController.getPendingBranches
);
router.post(
  '/',
  Author([RoleEnum.MANAGER]),
  validate(createBranchSchema),
  BranchController.requestCreateBranch
);
router.put(
  '/update-status',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  validate(updateBranchStatusSchema),
  BranchController.updateStatus
);
router.put(
  '/:id',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  BranchController.update
);
router.delete(
  '/:id',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  BranchController.delete
);
router.post(
  '/handle-request',
  Author([RoleEnum.OPERATOR, RoleEnum.ADMIN]),
  BranchController.handleRequest
);
router.get(
  '/get-my-branchs',
  authentication,
  Author([RoleEnum.MANAGER, RoleEnum.STAFF, RoleEnum.ADMIN, RoleEnum.OPERATOR]),
  BranchController.getMyBranchs
);
export default router;
