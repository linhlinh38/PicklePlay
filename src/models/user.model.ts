import { GenderEnum, RoleEnum, UserStatusEnum } from '../utils/enums';

const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(RoleEnum)
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      require: true
    },
    dob: {
      type: Date,
    },
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model('User', userSchema)
export default userModel;
