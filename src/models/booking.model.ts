import { Schema } from "zod";

const mongoose = require("mongoose");
const bookingSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    total_price: {
      type: String,
      required: true,
    },
    total_hour: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
