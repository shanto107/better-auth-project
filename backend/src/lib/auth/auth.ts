import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../drizzle/db.js"; // your drizzle instance
import { sendPasswordResetEmail } from "../emails/send-password-reset-email.js";
import { sendEmailVerificationEmail } from "../emails/send-email-verification-email.js";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../emails/send-welcome-email.js";
import { sendDeleteAccountVerificationEmail } from "../emails/send-delete-account-verification-email.js";
import {
  admin as adminPlugin,
  organization,
  twoFactor,
} from "better-auth/plugins";
import { ac, user, admin } from "./permission.js";
import { sendOrganizationInviteEmail } from "../emails/send-organization-invite-email.js";
import { desc, eq } from "drizzle-orm";
import { member } from "../../drizzle/schema.js";

export const auth = betterAuth({
  appName: "Auth Practice",

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
        await sendEmailVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url });
      },
    },
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true,
      },
    },
  },

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
      mapProfileToUser: (profile) => {
        return {
          favoriteNumber: Number(profile.public_repos) || 0,
        };
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  plugins: [
    twoFactor(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    organization({
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email,
        });
      },
    }),
  ],

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith("/verify-email")) {
        return;
      }
      const user = ctx.context.newSession?.user;
      if (!user) {
        console.warn(
          "[Better Auth] No session user available after email verification.",
        );
        return;
      }
      await sendWelcomeEmail(user);
    }),
  },

  databaseHooks: {
    session: {
      create: {
        before: async (userSession) => {
          const membership = await db.query.member.findFirst({
            where: eq(member.userId, userSession.userId),
            orderBy: desc(member.createdAt),
            columns: { organizationId: true },
          });
          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          };
        },
      },
    },
  },

  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:5173"],
});

export type Auth = typeof auth;
