import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}
