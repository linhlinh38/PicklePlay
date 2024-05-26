import { Schema } from "zod";

const mongoose = require("mongoose");
const courtSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const courtModel = mongoose.model("Court", courtSchema);
export default courtModel;
