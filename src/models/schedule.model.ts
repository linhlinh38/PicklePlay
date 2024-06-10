import { ScheduleStatusEnum } from '../utils/enums';

const mongoose = require('mongoose');
const scheduleSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    slots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
      }
    ],
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ScheduleStatusEnum)
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const scheduleModel = mongoose.model('Schedule', scheduleSchema);
export default scheduleModel;
