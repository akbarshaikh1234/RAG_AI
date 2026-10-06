import { sign } from "crypto";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: NextAuthOptions = {
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

  pages: {
    signIn: "/login",
  },

  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log("signIn callback", { user, account, profile });
      return true;
    },
    jwt: async ({ token, user }) => {
      console.log(token, user);
       return token
    },
    session: async ({ session, token }) => {
      console.log("session callback", { session, token });
      return session;
    }
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