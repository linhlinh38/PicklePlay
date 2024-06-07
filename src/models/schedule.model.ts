import { ScheduleStatusEnum } from '../utils/enums';

const mongoose = require('mongoose');
const scheduleSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    // startDate: {
    //   type: Date,
    //   required: true
    // },
    // endDate: {
    //   type: Date,
    //   required: true
    // },
    slot: {
      type: String,
      required: true
    },
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
      ref: 'Booking',
      required: true
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
