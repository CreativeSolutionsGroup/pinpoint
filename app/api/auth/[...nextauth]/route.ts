import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/api/db";
import { AuthorizedUser, Roles } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    id_token: unknown;
    isAdmin: boolean;
    role: string;
  }
}

const isAuthDisabled = process.env["DISABLE_AUTH_FOR_STAGING"] === "true";

// create providers based on env
const providers = isAuthDisabled
  ? [
      CredentialsProvider({
        name: "Staging (no auth)",
        credentials: {},
        async authorize() {
          const email =
            process.env["STAGING_FAKE_EMAIL"] || "staging@example.com";
          return { id: "fake-id", name: email.split("@")[0], email };
        },
      }),
    ]
  : [
      AzureADProvider({
        clientId: process.env["MS_CLIENT_ID"] || "",
        clientSecret: process.env["MS_CLIENT_SECRET"] || "",
        tenantId: process.env["MS_TENANT_ID"],
      }),
    ];

const defaultOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user: { email } }) {
      if (isAuthDisabled) {
        // always allow sign-in in staging/no-auth mode
        return true;
      }
      return !!(await prisma.authorizedUser.count({
        where: { email: email ?? "" },
      }));
    },
    async jwt({ token, account }) {
      // Persist the id_token to the token
      if (account) {
        token.id_token = account.id_token;
      }

      if (isAuthDisabled) {
        // Populate token from envs for staging
        token.isAdmin = process.env["STAGING_FAKE_IS_ADMIN"] === "true";
        token.role = process.env["STAGING_FAKE_ROLE"] || Roles.EDITOR;
        return token;
      }

      const user: AuthorizedUser | null = await prisma.authorizedUser.findFirst(
        {
          where: { email: token.email ?? "" },
        }
      );

      token.isAdmin = user?.role === Roles.ADMIN;
      token.role = user?.role;

      return token;
    },
    async session({ session, token }) {
      // Send send the id_token to the client
      session.id_token = token.id_token;

      // session.roles = token.roles;
      session.isAdmin = token.isAdmin as boolean;
      session.role = token.role as string;

      return session;
    },
  },
};

// define sgt options
// if builenv is stg, return stg options etc etc

const handler = NextAuth(defaultOptions);
export { handler as GET, handler as POST };
