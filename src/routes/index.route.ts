import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import managerRoute from './manager.route';
import packageCourtRoute from './packageCourt.route';
import packagePurchaseRoute from './packagePurchase.route';
import { NextFunction, Request, Response } from 'express';
import bucket from '../config/firebaseConfig';
import path from 'path';
import upload from '../config/multerConfig';

const indexRoute = express.Router();

indexRoute.use('/user', userRoute);
indexRoute.use('/auth', authRoute);
indexRoute.use('/manager', managerRoute);
indexRoute.use('/package-court', packageCourtRoute);
indexRoute.use('/package-purchase', packagePurchaseRoute);
indexRoute.post(
  '/upload',
  upload.array('f', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.files);

      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadPromises = req.files.map((file: Express.Multer.File) => {
        const blob = bucket.file(Date.now() + path.extname(file.originalname));
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        });

        return new Promise<string>((resolve, reject) => {
          blobStream.on('error', (err) => reject(err));
          blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          });
          blobStream.end(file.buffer);
        });
      });

      const fileUrls = await Promise.all(uploadPromises);
      res
        .status(200)
        .json({ message: 'Files uploaded successfully', fileUrls });
    } catch (error) {
      next(error);
    }
  }
);
export default indexRoute;
