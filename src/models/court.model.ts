import { CourtStatusEnum } from '../utils/enums';

const mongoose = require('mongoose');
const courtSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    description: {
      type: String
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(CourtStatusEnum)
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const courtModel = mongoose.model('Court', courtSchema);
export default courtModel;
