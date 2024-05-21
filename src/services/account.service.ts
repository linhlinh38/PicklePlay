import accountModel from "../models/account.model";
import { createAccountType } from "../models/validateSchema/createAccount.validate.schema";
import { DatabaseError, ServerError } from "../utils/error";

async function createAccount(
  username: string,
  email: string,
  role: string,
  password: string
) {
  try {
    const account = new accountModel({
      username: username,
      email: email,
      role: role,
    });
    //encrypted password
    account.password = account.encryptedPassword(password);

    await account.save();
    return account as createAccountType;
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw new ServerError("Validation error: " + error.message);
    } else {
      throw new DatabaseError("Database error: " + error.message);
    }
  }
}

async function getAllAccount(): Promise<createAccountType[]> {
  try {
    const accounts: createAccountType[] = await accountModel
      .find()
      .select("id username email role");
    return accounts as createAccountType[];
  } catch (error: any) {
    throw new DatabaseError("Database error: " + error.message);
  }
}

async function findUserByUsernameOrEmail(
  username: string,
  email: string
): Promise<createAccountType[]> {
  try {
    const accounts: createAccountType[] = await accountModel
      .find({
        $or: [{ username: username }, { email: email }],
      })
      .select("id username email role");
    return accounts as createAccountType[];
  } catch (error: any) {
    throw new DatabaseError("Database error: " + error.message);
  }
}

export default {
  createAccount,
  getAllAccount,
  findUserByUsernameOrEmail,
};
