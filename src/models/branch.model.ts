import { Schema } from "zod";

const mongoose = require("mongoose");
const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    license: [
      {
        type: String,
        required: true,
      },
    ],
    total_court: {
      type: String,
      required: true,
    },
    slot_duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    available_time: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      required: true,
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const branchModel = mongoose.model("Branch", branchSchema);
export default branchModel;
