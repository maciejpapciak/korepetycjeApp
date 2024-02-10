const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  dbSettings: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbname: process.env.DB_DATABASE_NAME,
    ssl: process.env.DB_SSLMODE,
  },
  appSettings: {
    port: process.env.DEV_PORT,
    nodeEnv: process.env.NODE_ENV,
  },
  jwtSettings: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  smtpSettings: {
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: process.env.EMAIL_SMTP_SECURE,
    auth: {
      user: process.env.EMAIL_SMTP_USERNAME,
      pass: process.env.EMAIL_SMTP_PASSWORD,
    },
  },
};
