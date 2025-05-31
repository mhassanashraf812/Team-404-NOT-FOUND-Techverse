import { verifyPassword } from "@/lib/authHelper";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { atob } from "buffer";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import io from "../../../lib/io";
if (!global.ioInitialized) {
  io.emit("dummy", "runServer");
}
const authHandler: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuth(req, res, options);
export default authHandler;
export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          let { email, password } = req.body as {
            email: string;
            password: string;
          };

          const dbUser = await prisma.user.findFirst({
            where: {
              email,
            },
          });
          if (!dbUser) {
            throw new Error("No user found for:" + email);
          }
          const passwordMatch = await verifyPassword(password, dbUser.password);
          if (!passwordMatch) {
            throw new Error("Incorrect password for:" + email);
          }
          const user = {
            ...dbUser,
            name: dbUser.name,
            id: dbUser.id,
          };
          return user;
        } catch (error) {
          console.error("Error in user authorization:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 30 * 60,
  },
  debug: process.env.ENV !== "PROD",
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    jwt: ({ token, user, profile, trigger, session }) => {
      return { ...token };
    },

    session: async ({ session, token }: any) => {
      const userData: any = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (userData) {
        return {
          ...session,
          user: {
            ...session?.user,
            id: userData.id,
            role: userData.role,
            name: userData.name,
            email: userData.email,
            studentId: userData.studentId,
            phone: userData.phone,
            department: userData.department,
          },
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/404",
  },
};
