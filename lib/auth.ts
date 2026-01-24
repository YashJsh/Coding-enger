import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import dotenv from "dotenv";
import { Database } from "lucide-react";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
    adapter
});

export const auth = betterAuth({
     emailAndPassword: {
        enabled: true,
    },
    session : {
        cookieCache : {
            enabled : true,
            maxAge : 60,
        }
    },
    rateLimit : {
        enabled : true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
});