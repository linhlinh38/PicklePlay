import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;
const SECRETKEY = process.env.SECRETKEY;
export const config = {
  mongo_uri: MONGO_DB_URI,
  port: PORT,
  secretKey: SECRETKEY,
};
