import NextAuth, { AuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "@/lib/api/db";
import CredentialsProvider from "next-auth/providers/credentials";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MS_CLIENT_ID: string;
      MS_CLIENT_SECRET: string;
      MS_TENANT_ID: string;
    }
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    id_token: unknown;
    roles: Array<string>;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: Array<string>;
    isAdmin: boolean;
  }
}

const stgOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const user = await prisma.authorizedUser.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const authorizedUser = await prisma.authorizedUser.findFirst({
        where: { email: token.email ?? "" },
        include: { role: true },
      });
      token.isAdmin =
        authorizedUser!.roles.find((r) => r.name === "admin") != undefined;
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // Send send the id_token to the client
      session.id_token = token.id_token;

      // session.roles = token.roles;
      session.isAdmin = token.isAdmin;

      return session;
    },
  },
};

const defaultOptions: AuthOptions = {
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
    async signIn({ user: { email }, credentials }) {
      return !!(await prisma.authorizedUser.count({
        where: { email: email ?? "" },
      }));
    },
    async jwt({ token, account }) {
      // Persist the id_token to the token
      if (account) {
        token.id_token = account.id_token;
      }

      let authorizedUser = await prisma.authorizedUser.findFirst({
        where: { email: token.email ?? "" },
        include: { roles: true },
      });
      // we think that authorizedUser here is not undefined because `singIn` should have caught anyone not in the database.
      // token.roles = authorizedUser!.roles.map(r => r.name);
      token.isAdmin =
        authorizedUser!.roles.find((r) => r.name === "admin") != undefined;

      return token;
    },
    async session({ session, token }) {
      // Send send the id_token to the client
      session.id_token = token.id_token;

      // session.roles = token.roles;
      session.isAdmin = token.isAdmin;

      return session;
    },
  },
};

export const authOptions: AuthOptions =
  process.env.BUILD_ENV === "stg" ? stgOptions : defaultOptions;

export default NextAuth(authOptions);
