import dotenv from 'dotenv';
import { MailerSend } from 'mailersend';

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;
const SECRET_KEY_FOR_ACCESS_TOKEN = process.env.SECRET_KEY_FOR_ACCESS_TOKEN;
const SECRET_KEY_FOR_REFRESH_TOKEN = process.env.SECRET_KEY_FOR_REFRESH_TOKEN;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
const VNP_TMN_CODE = process.env.VNP_TMN_CODE;
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_API = process.env.VNP_API;
const VNP_RETURN_URL = process.env.VNP_RETURN_URL;
export const config = {
  mongo_uri: MONGO_DB_URI,
  port: PORT,
  SECRET_KEY_FOR_ACCESS_TOKEN: SECRET_KEY_FOR_ACCESS_TOKEN,
  SECRET_KEY_FOR_REFRESH_TOKEN: SECRET_KEY_FOR_REFRESH_TOKEN,
  FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID,
  VNP: {
    TMN_CODE: VNP_TMN_CODE,
    HASH_SECRET: VNP_HASH_SECRET,
    URL: VNP_URL,
    API: VNP_API,
    RETURN_URL: VNP_RETURN_URL
  }
};

export const mailersend = new MailerSend({
  apiKey: MAILERSEND_API_KEY
});
