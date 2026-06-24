import { registerAs } from "@nestjs/config";
import { env } from "./env";

export const emailConfig = registerAs('email', () => ({
    emailHost: env.EMAIL_HOST,
    emailPort: env.EMAIL_PORT,
    emailUser: env.EMAIL_USER,
    emailPass: env.EMAIL_PASS,
    emailFrom: env.EMAIL_FROM
}))