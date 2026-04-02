import dotenv from "dotenv";

dotenv.config();

const REQUIRED_ENV_VARS = [
  "PORT",
  "MONGODB_URI",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM_EMAIL",
  "SMTP_FROM_NAME",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "ADMIN_EMAIL",
  "ADMIN_NAME",
  "ADMIN_PASSWORD",
] as const;

export function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[env] Missing required environment variable(s): ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongodbUri: process.env.MONGODB_URI as string,
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "Form Submission API",
  smtpHost: process.env.SMTP_HOST as string,
  smtpPort: Number(process.env.SMTP_PORT),
  smtpUser: process.env.SMTP_USER as string,
  smtpPass: process.env.SMTP_PASS as string,
  smtpFromName: process.env.SMTP_FROM_NAME as string,
  smtpFromEmail: process.env.SMTP_FROM_EMAIL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  adminEmail: process.env.ADMIN_EMAIL as string,
  adminName: process.env.ADMIN_NAME as string,
  adminPassword: process.env.ADMIN_PASSWORD as string,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
};
