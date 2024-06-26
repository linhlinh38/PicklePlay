import mongoose from 'mongoose';

export function checkValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}
