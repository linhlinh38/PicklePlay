import express from 'express';
import uploadImage from '../config/multerConfig';
import FileController from '../controllers/file.controller';

const router = express.Router();
router.post('/upload', uploadImage.any(), FileController.upload);
router.delete('/delete', FileController.delete);
export default router;
