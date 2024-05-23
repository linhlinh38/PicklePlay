import { IUser } from "../interfaces/user.interface";
import userModel from "../models/user.model";
import { createUserType } from "../models/validateSchema/createUser.validate.schema";
import { ICRUDService } from "../utils/ICRUDService";
import { DatabaseError, ServerError } from "../utils/error";

class UserService implements ICRUDService<IUser> {
  async create(data: IUser): Promise<IUser> {
    try {
      const user = new userModel(data);
      user.password = user.encryptedPassword(data.password);
      await user.save();
      return user;
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new ServerError("Validation error: " + error.message);
      } else {
        throw new DatabaseError("Database error: " + error.message);
      }
    }
  }

  async getById(id: string): Promise<IUser> {
    try {
      const user = await userModel
        .findById(id)
        .select("id username first_name last_name email role gender phone");

      return user;
    } catch (error) {
      throw new DatabaseError("Database error: " + error.message);
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      const users: IUser[] = await userModel
        .find()
        .select("id username email role gender first_name last_name phone");
      return users;
    } catch (error: any) {
      throw new DatabaseError("Database error: " + error.message);
    }
  }

  update(id: string, data: Partial<IUser>): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findUserByUsernameOrEmail(
    username: string,
    email: string
  ): Promise<createUserType[]> {
    try {
      const users: createUserType[] = await userModel
        .find({
          $or: [{ username: username }, { email: email }],
        })
        .select("id username email role");
      return users as createUserType[];
    } catch (error: any) {
      throw new DatabaseError("Database error: " + error.message);
    }
  }
}

export const userService = new UserService();
