import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import managerRoute from './manager.route';
import packageCourtRoute from './packageCourt.route';
import packagePurchaseRoute from './packagePurchase.route';
import branchRoute from './branch.route';
import { NextFunction, Request, Response } from 'express';
import upload from '../config/multerConfig';
import { filesUploadProcessing } from '../utils/fileUploadProcessing';

const indexRoute = express.Router();

indexRoute.use('/user', userRoute);
indexRoute.use('/auth', authRoute);
indexRoute.use('/manager', managerRoute);
indexRoute.use('/package-court', packageCourtRoute);
indexRoute.use('/package-purchase', packagePurchaseRoute);
indexRoute.use('/branch', branchRoute);
indexRoute.post(
  '/upload',
  upload.array('f', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      res
        .status(200)
        .json({
          message: 'Files uploaded successfully',
          fileUrls: await filesUploadProcessing(req.files)
        });
    } catch (error) {
      next(error);
    }
  }
);
export default indexRoute;
