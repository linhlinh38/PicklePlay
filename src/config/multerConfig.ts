import multer from 'multer';
import { BadRequestError } from '../errors/badRequestError';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new BadRequestError(
          'Error: File upload only supports the following filetypes - ' +
            filetypes
        )
      );
    }
  }
});

export default upload;
