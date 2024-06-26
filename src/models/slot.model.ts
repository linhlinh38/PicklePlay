import { WeekDayEnum } from '../utils/enums';

const mongoose = require('mongoose');
const slotSchema = mongoose.Schema(
  {
    weekDay: {
      type: String,
      required: true,
      enum: Object.values(WeekDayEnum)
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    surcharge: {
      type: Number,
      required: true
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

const slotModel = mongoose.model('Slot', slotSchema);
export default slotModel;
