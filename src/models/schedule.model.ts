import { Schema } from "zod";

const mongoose = require("mongoose");
const scheduleSchema = mongoose.Schema(
  {
    type: {
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
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    court_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const scheduleModel = mongoose.model("Schedule", scheduleSchema);
export default scheduleModel;
