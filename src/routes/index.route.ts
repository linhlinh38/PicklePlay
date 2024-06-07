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
import customerRoute from './customer.route';
import courtRoute from './court.route';
import bookingRouter from './booking.route';

const router = express.Router();

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/customer', customerRoute);
router.use('/court', courtRoute);
router.use('/manager', managerRoute);
router.use('/package-court', packageCourtRoute);
router.use('/package-purchase', packagePurchaseRoute);
router.use('/branch', branchRoute);
router.use('/booking', bookingRouter);
router.post(
  '/upload',
  upload.fields([
    {
      name: 'branchs',
      maxCount: 10
    },
    {
      name: 'courts',
      maxCount: 10
    },
    {
      name: 'license',
      maxCount: 10
    }
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as any;

      // if (!req.files || !Array.isArray(req.files)) {
      //   return res.status(400).json({ message: 'No files uploaded' });
      // }
      const branchsUrls = await filesUploadProcessing(files.branchs);
      const courtsUrls = await filesUploadProcessing(files.courts);
      const licenseUrls = await filesUploadProcessing(files.license);

      const fileUrls = {
        branchs: branchsUrls,
        courts: courtsUrls,
        license: licenseUrls
      };

      res.status(200).json({
        message: 'Files uploaded successfully',
        fileUrls: fileUrls
      });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
