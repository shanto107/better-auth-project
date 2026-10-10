import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/db.js"; // your drizzle instance
import { sendPasswordResetEmail } from "./emails/send-password-reset-email.js";
import { sendEmailVerificationEmail } from "./emails/send-email-verification-email.js";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "./emails/send-welcome-email.js";

console.log("[Auth config] Loading email verification configuration");
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }) => {
      console.log("[Better Auth] Existing user signup attempt:", user.email);
    },
    sendResetPassword: async ({ user, url }) => {
      console.log("[Better Auth] Password reset callback:", user.email);
      await sendPasswordResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log("[Better Auth] Verification callback:", user.email);
      await sendEmailVerificationEmail({ user, url });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
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

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path.startsWith("/sign-up") ||
        ctx.path.startsWith("/verify-email")
      ) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };
        if (user !== null) {
          await sendWelcomeEmail(user);
        }
      }
    }),
  },

  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:5173"],
});
