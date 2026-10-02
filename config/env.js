const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

module.exports = {
  PORT,
  NODE_ENV,
  BASE_URL,
  DB_NAME,
  DB_USER,
  LOGGING,
  DB_PASS,
  DB_PORT,
  SESSION_SECRET,
  DATABASE_URL,
  PAYSTACK_SECRET_KEY,
  SHIPPO_API_KEY,
  CLIENT_URL,
  SERVER_URL,
  JWT_WEB_SECRET_KEY,
  JWT_WEB_REFRESH_SECRET_KEY,
  FACEBOOK_APP_SECRET,
  FACEBOOK_APP_ID,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  AUTH_EMAIL,
  AUTH_PASS,
} = process.env;
