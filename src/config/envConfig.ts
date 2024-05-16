import { connect, set } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;

export const config = {
  mongo_uri: MONGO_DB_URI,
  port: PORT,
};
