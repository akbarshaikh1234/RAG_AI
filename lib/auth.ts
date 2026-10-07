import { sign } from "crypto";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./db/mongoose";
import User from "@/model/User";


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
   session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log("signIn callback", { user, account, profile });

       if (!user.email) {
        return false;
      }

      await dbConnect();

      await User.findOneAndUpdate(
        {
          email: user.email,
        },
        {
          name: user.name,
          email: user.email,
          image: user.image,

          provider: account?.provider,

          providerAccountId: account?.providerAccountId,
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );

      return true;
    },
    jwt: async ({ token, user }) => {
      if (!token.email) {
        return token;
      }

      await dbConnect();

      const dbUser = await User.findOne({
        email: token.email,
      })

      if (dbUser) {
        token.userId = dbUser._id.toString();
      }

      return token;
    },
    session: async ({ session, token }) => {
      console.log("session callback", { session, token });
     if (
        session.user &&
        token.userId
      ) {
        session.user.id = token.userId as string;
      }

      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      console.log("redirect callback", { url, baseUrl });
      return baseUrl;
    },
  }
}

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
