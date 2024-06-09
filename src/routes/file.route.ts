import express from 'express';
import { uploadFile, uploadImage } from '../config/multerConfig';
import FileController from '../controllers/file.controller';

const router = express.Router();
router.post('/upload', uploadFile.any(), FileController.upload);
router.post('/upload-images', uploadImage.any(), FileController.upload);
router.delete('/delete', FileController.delete);
export default router;
