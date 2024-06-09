import multer from 'multer';
import { BadRequestError } from '../errors/badRequestError';
import { regexFile, regexImage } from '../utils/regex';

const storage = multer.memoryStorage();

const upload = (fileTypes: RegExp) =>
  multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
      const filetypes = fileTypes;
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

export const uploadImage = upload(regexImage);
export const uploadFile = upload(regexFile);
