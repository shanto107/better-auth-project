import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/db.js"; // your drizzle instance

export const auth = betterAuth({
    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }
    },

    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },

    database: drizzleAdapter(db, {
        provider: "pg",
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: ["http://localhost:5173"],
});