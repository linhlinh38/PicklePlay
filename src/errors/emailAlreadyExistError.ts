import { HttpError } from './httpError';

export class EmailAlreadyExistError extends HttpError {
  constructor(message: string = 'Email already exist!') {
    super(message, 400);
  }
}
