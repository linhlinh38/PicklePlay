import path from 'path';
import bucket from '../config/firebaseConfig';

export const filesUploadProcessing = async (files: Express.Multer.File[]) => {
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
};
