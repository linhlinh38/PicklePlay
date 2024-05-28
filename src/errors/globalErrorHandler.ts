import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError'; // Import your custom HttpError class
import { DatabaseError } from '../utils/error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  console.log(123);
  if (!err) return next();
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof DatabaseError) {
    res.status(503).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
}
