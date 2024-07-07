import { RoleEnum, UserStatusEnum } from '../utils/enums';

const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(RoleEnum)
    },
    gender: {
      type: String,
      default: ''
    },
    firstName: {
      default: '',
      type: String
    },
    lastName: {
      default: '',
      type: String
    },
    phone: {
      default: '',
      type: String
    },
    status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      require: true
    },
    dob: {
      default: '',
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
