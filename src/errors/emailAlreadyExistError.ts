import { HttpError } from './httpError';

export class EmailAlreadyExistError extends HttpError {
  constructor(message: string = 'Email already existed!') {
    super(message, 400);
  }
}
