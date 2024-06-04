import express from 'express';
import validate from '../utils/validate';
import BranchController from '../controllers/branch.controller';
import upload from '../config/multerConfig';
import { createBranchSchema } from '../models/validateSchema/createBranch.validate.schema';

const router = express.Router();
// router.use(auth);
router.get('/', BranchController.getAll);
router.get('/get-pending', BranchController.getPendingBranches);
router.post(
  '/',
  validate(createBranchSchema),
  upload.array('images', 10),
  BranchController.requestCreateBranch
);
router.put('/:id', BranchController.update);
router.delete('/:id', BranchController.delete);
router.get('/:id', BranchController.getById);
export default router;
