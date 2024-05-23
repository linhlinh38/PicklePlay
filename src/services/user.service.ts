import { IUser } from "../interfaces/user.interface";
import userModel from "../models/user.model";
import { createUserType } from "../models/validateSchema/createUser.validate.schema";
import { ICRUDService } from "../utils/ICRUDService";
import { DatabaseError, ServerError } from "../utils/error";
import { BaseService } from "./base.service";
const bcrypt = require("bcrypt");

class UserService extends BaseService<IUser> {
  constructor() {
    super(userModel);
  }

  encryptedPassword = function (password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  // async getById(id: string): Promise<IUser> {
  //   try {
  //     const user = await userModel
  //       .findById(id)
  //       .select("id username first_name last_name email role gender phone");

  //     return user;
  //   } catch (error) {
  //     throw new DatabaseError("Database error: " + error.message);
  //   }
  // }
}

export const userService = new UserService();
