import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/httpError'; // Import your custom HttpError class
import Logging from '../utils/logging';
import { DatabaseError } from './databaseError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!err) return next();
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof DatabaseError) {
    Logging.error(err);
    res.status(503).json({ message: err.message });
  } else {
    Logging.error(err);
    res.status(500).json({ message: err.message });
  }
}
