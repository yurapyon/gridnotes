import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "../db/prisma";
import superjson from "superjson";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerSession(authOptions);
  return {
    prisma,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
