import dotenv from 'dotenv';
import { MailerSend } from 'mailersend';

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;
const SECRET_KEY_FOR_ACCESS_TOKEN = process.env.SECRET_KEY_FOR_ACCESS_TOKEN;
const SECRET_KEY_FOR_REFRESH_TOKEN = process.env.SECRET_KEY_FOR_REFRESH_TOKEN;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
export const config = {
  mongo_uri: MONGO_DB_URI,
  port: PORT,
  SECRET_KEY_FOR_ACCESS_TOKEN: SECRET_KEY_FOR_ACCESS_TOKEN,
  SECRET_KEY_FOR_REFRESH_TOKEN: SECRET_KEY_FOR_REFRESH_TOKEN,
  FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID
};

export const mailersend = new MailerSend({
  apiKey: MAILERSEND_API_KEY
});
