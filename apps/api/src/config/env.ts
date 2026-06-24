import { createEnv } from "@t3-oss/env-core";
import { config } from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

config({
    path: resolve(process.cwd(), '../../.env')
});

export const env = createEnv({
    server: {
        NODE_ENV: z
            .enum(['development', 'production'])
            .default('development'),
        PORT: z.coerce.number().int().positive().default(3000),
        CLIENT_URL: z.url().default('http://localhost:3001'),

            
        DATABASE_HOST: z.string().min(1),
        DATABASE_PORT: z.coerce.number().int().positive().default(5432),
        DATABASE_USER: z.string().min(1),
        DATABASE_PASSWORD: z.string(),
        DATABASE_NAME: z.string().min(1),
        DATABASE_SYNC: z
        .union([z.boolean(), z.enum(['true', 'false'])])
        .default(false)
        .transform((v) => v === true || v === 'true'),
        DATABASE_LOGGING: z
        .union([z.boolean(), z.enum(['true', 'false'])])
        .default(false)
        .transform((v) => v === true || v === 'true'),
        DATABASE_SSL: z
        .union([z.boolean(), z.enum(['true', 'false'])])
        .default(false)
        .transform((v) => v === true || v === 'true'),

        JWT_ACCESS_SECRET: z
            .string()
            .min(32, 'JWT_ACCESS_SECRET must be at least chars'),
        JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
        JWT_REFRESH_SECRET: z
            .string()
            .min(32, 'JWT_REFRESH_SECRET must be at least chars'),
        JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

        EMAIL_HOST: z.hostname(),
        EMAIL_PORT: z.coerce.number().int().positive().default(587),
        EMAIL_USER: z.email().default('kavira@kavira.com'),
        EMAIL_PASS: z.string(),
        EMAIL_FROM: z.email().default('noreply@kavira.dev'),

        REDIS_HOST: z.string().default('localhost'),
        REDIS_PORT: z.coerce.number().int().positive().default(6379),
        REDIS_DEFAULT_TTL: z.coerce.number().int().positive().default(900),

        COOKIE_DOMAIN: z.string().default('.kavira.dev'),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
})

export type Env = typeof env;
