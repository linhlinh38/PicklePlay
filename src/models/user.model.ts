const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phone: {
      type: String,
    },
    expried_date: {
      type: String,
    },
    max_court: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// hash the password
userSchema.methods.encryptedPassword = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
