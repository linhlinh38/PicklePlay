import path from 'path';
import bucket from '../config/firebaseConfig';
import { BadRequestError } from '../errors/badRequestError';

export default class FileService {
  static async upload(files: Express.Multer.File[]) {
    if (!files || !Array.isArray(files)) {
      throw new BadRequestError('No files uploaded');
    }

    const uploadPromises = files.map((file: Express.Multer.File) => {
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

    return await Promise.all(uploadPromises);
  }
}
