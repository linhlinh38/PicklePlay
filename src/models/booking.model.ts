import { BookingStatusEnum } from '../utils/enums';

const mongoose = require('mongoose');
const bookingSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    paymentType: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    totalHour: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(BookingStatusEnum)
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
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

const bookingModel = mongoose.model('Booking', bookingSchema);
export default bookingModel;
