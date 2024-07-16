import express from 'express';
import {
  handleMulterErrors,
  uploadFile,
  uploadImage
} from '../config/multerConfig';
import FileController from '../controllers/file.controller';

const router = express.Router();
router.post('/upload', uploadFile, handleMulterErrors, FileController.upload);
router.post(
  '/upload-images',
  uploadImage,
  handleMulterErrors,
  FileController.upload
);
router.delete('/delete', FileController.delete);
export default router;
