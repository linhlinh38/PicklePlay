import { Request, Response, NextFunction } from 'express';
import FileService from '../services/file.service';

export default class FileController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[];
    try {
      res.status(200).json({
        message: 'Upload success',
        data: await FileService.upload(files)
      });
    } catch (err) {
      next(err);
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    const { urls } = req.body;
    try {
      await FileService.delete(urls);
      res.status(200).json({
        message: 'Delete success'
      });
    } catch (err) {
      next(err);
    }
  }
}
