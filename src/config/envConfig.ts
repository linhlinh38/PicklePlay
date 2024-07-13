import dotenv from 'dotenv';
import { MailerSend } from 'mailersend';

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;
const SECRET_KEY_FOR_ACCESS_TOKEN = process.env.SECRET_KEY_FOR_ACCESS_TOKEN;
const SECRET_KEY_FOR_REFRESH_TOKEN = process.env.SECRET_KEY_FOR_REFRESH_TOKEN;
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
const VNP_TMN_CODE = process.env.VNP_TMN_CODE;
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_API = process.env.VNP_API;
const VNP_RETURN_URL = process.env.VNP_RETURN_URL;
const GG_CLIENT_ID = process.env.GG_CLIENT_ID;

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_PRIVATE_KEY_ID = process.env.FIREBASE_PRIVATE_KEY_ID;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY.split(
  String.raw`\n`
).join('\n');

const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_CLIENT_ID = process.env.FIREBASE_CLIENT_ID;
const FIREBASE_AUTH_URI = process.env.FIREBASE_AUTH_URI;
const FIREBASE_TOKEN_URI = process.env.FIREBASE_TOKEN_URI;
const FIREBASE_AUTH_PROVIDER_X509_CERT_URL =
  process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL;
const FIREBASE_CLIENT_X509_CERT_URL = process.env.FIREBASE_CLIENT_X509_CERT_URL;

export const config = {
  mongo_uri: MONGO_DB_URI,
  port: PORT,
  SECRET_KEY_FOR_ACCESS_TOKEN: SECRET_KEY_FOR_ACCESS_TOKEN,
  SECRET_KEY_FOR_REFRESH_TOKEN: SECRET_KEY_FOR_REFRESH_TOKEN,
  FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
  VNP: {
    TMN_CODE: VNP_TMN_CODE,
    HASH_SECRET: VNP_HASH_SECRET,
    URL: VNP_URL,
    API: VNP_API,
    RETURN_URL: VNP_RETURN_URL
  },
  GG_CLIENT_ID: GG_CLIENT_ID
};

export const mailersend = new MailerSend({
  apiKey: MAILERSEND_API_KEY
});
