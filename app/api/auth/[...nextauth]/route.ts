import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "@/lib/api/db";
import { AuthorizedUser, Roles } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    id_token: unknown;
    isAdmin: boolean;
  }
}

const defaultOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env["MS_CLIENT_ID"] || "",
      clientSecret: process.env["MS_CLIENT_SECRET"] || "",
      tenantId: process.env["MS_TENANT_ID"],
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user: { email } }) {
      return !!(await prisma.authorizedUser.count({
        where: { email: email ?? "" },
      }));
    },
    async jwt({ token, account }) {
      // Persist the id_token to the token
      if (account) {
        token.id_token = account.id_token;
      }

      const user: AuthorizedUser | null =
        await prisma.authorizedUser.findFirst({
          where: { email: token.email ?? "" },
        });

      token.isAdmin = user?.role === Roles.ADMIN;

      return token;
    },
    async session({ session, token }) {
      // Send send the id_token to the client
      session.id_token = token.id_token;

      // session.roles = token.roles;
      session.isAdmin = token.isAdmin as boolean;

      return session;
    },
  },
};

// define sgt options
// if builenv is stg, return stg options etc etc

const handler = NextAuth(defaultOptions);
export { handler as GET, handler as POST };
