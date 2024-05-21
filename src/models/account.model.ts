const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const accountSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

// hash the password
accountSchema.methods.encryptedPassword = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const accountModel = mongoose.model("Account", accountSchema);
export default accountModel;
