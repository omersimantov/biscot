/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from "@/lib/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { DefaultSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    // Include user.id on session
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  pages: {
    signIn: "/",
    signOut: "/logout"
  },
  debug: process.env.NODE_ENV === "development"
};

export default NextAuth(authOptions);
