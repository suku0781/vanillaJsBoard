// config.ts
import dotenv from "dotenv";
dotenv.config();

export default {
  // ...other configures
  mailer: {
    gmailUser: process.env.GMAIL_OAUTH_USER,
    gmailClientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    gmailClientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
    gmailRefreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
  },
};