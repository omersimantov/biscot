import { prisma } from "@/lib/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  session: {
    maxAge: 10 * 12 * 30 * 24 * 60 * 60 // 10 years, it's a damn to-do app
  },
  adapter: PrismaAdapter(prisma),
  providers: [],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify", // Used for check email message
    newUser: "/auth/new" // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  debug: process.env.NODE_ENV === "development"
};

export default NextAuth(authOptions);
