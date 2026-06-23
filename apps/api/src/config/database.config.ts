import { registerAs } from "@nestjs/config";
import { env } from "./env";

export const databaseConfig = registerAs('database', () => ({
    dbHost: env.DATABASE_HOST,
    dbPort: env.DATABASE_PORT,
    dbUser: env.DATABASE_USER,
    dbPassword: env.DATABASE_PASSWORD,
    dbName: env.DATABASE_NAME,
    dbSync: env.DATABASE_SYNC,
    dbLogging: env.DATABASE_LOGGING,
    dbSSL: env.DATABASE_SSL
}))