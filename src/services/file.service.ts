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

  static async delete(urls: string[]) {
    if (!urls || !Array.isArray(urls)) {
      throw new BadRequestError('No URLs provided');
    }

    const deletePromises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        try {
          const urlPath = new URL(url).pathname;
          const fileName = path.basename(urlPath);
          const file = bucket.file(fileName);

          file.delete((err) => {
            if (err) {
              if (err.message.includes('No such object:')) {
                return reject(new BadRequestError(`File not found: ${url}`));
              }
              return reject(err);
            }
            resolve(`Deleted: ${url}`);
          });
        } catch (err) {
          reject(err);
        }
      });
    });

    await Promise.all(deletePromises);
  }
}
