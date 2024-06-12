import { PrismaAdapter } from "@auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "./db/prisma";
import { Adapter } from "next-auth/adapters";
import { DefaultSession, NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
};
