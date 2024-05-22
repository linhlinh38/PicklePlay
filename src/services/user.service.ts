import userModel from "../models/user.model";
import { createUserType } from "../models/validateSchema/createUser.validate.schema";
import { DatabaseError, ServerError } from "../utils/error";

async function createUser(
  username: string,
  email: string,
  role: string,
  password: string,
  gender: string,
  firstname: string,
  lastname: string,
  phone: string
) {
  try {
    const user = new userModel({
      username: username,
      email: email,
      role: role,
      gender: gender,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      expried_date: "",
      max_court: "",
    });
    //encrypted password
    user.password = user.encryptedPassword(password);

    await user.save();
    return user as createUserType;
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw new ServerError("Validation error: " + error.message);
    } else {
      throw new DatabaseError("Database error: " + error.message);
    }
  }
}

async function getAllUsers(): Promise<createUserType[]> {
  try {
    const users: createUserType[] = await userModel
      .find()
      .select("id username email role gender first_name last_name phone");
    return users as createUserType[];
  } catch (error: any) {
    throw new DatabaseError("Database error: " + error.message);
  }
}

async function findUserByUsernameOrEmail(
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

export default {
  createUser,
  getAllUsers,
  findUserByUsernameOrEmail,
};
