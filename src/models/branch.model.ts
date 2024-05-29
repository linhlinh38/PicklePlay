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
        type: String,
        required: true
      }
    ],
    license: [
      {
        type: String,
        required: true
      }
    ],
    totalCourt: {
      type: Number,
      required: true
    },
    slotDuration: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    availableTime: [
      {
        type: String,
        required: true
      }
    ],
    status: {
      type: String,
      required: true,
      enum: Object.values(BranchStatusEnum)
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const branchModel = mongoose.model('Branch', branchSchema);
export default branchModel;
