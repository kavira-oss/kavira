import { registerAs } from "@nestjs/config";
import { env } from "./env";

export const appConfig = registerAs('app', () => ({
   nodeEnv: env.NODE_ENV,
   port: env.PORT,
   cookieDomain: env.COOKIE_DOMAIN,
   clientUrl: env.CLIENT_URL, 
}))