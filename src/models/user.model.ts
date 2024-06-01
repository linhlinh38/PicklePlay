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
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(RoleEnum)
    },
    gender: {
      type: String,
      required: true,
      enum: Object.values(GenderEnum)
    },
    firstName: {
      type: String,
      require: true
    },
    lastName: {
      type: String,
      require: true
    },
    phone: {
      type: String,
      require: true
    },
    status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      require: true
    },
    dob: {
      type: Date,
      require: true
    }
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model('User', userSchema)
export default userModel;
