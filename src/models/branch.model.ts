import { BranchStatusEnum } from '../utils/enums';

const mongoose = require('mongoose');
const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    licenses: [
      {
        type: String,
        required: true
      }
    ],
    description: {
      type: String
    },
    availableTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(BranchStatusEnum),
      default: BranchStatusEnum.PENDING
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
      required: true
    },
    courts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: true
      }
    ],
    slots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

const branchModel = mongoose.model('Branch', branchSchema);
export default branchModel;
