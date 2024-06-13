import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const projectRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.project.findUnique({
        where: {
          userId: ctx.session.user.id,
          id: input.id,
        },
      });
    }),

  getMenuOptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.project.create({
      data: {
        userId: ctx.session.user.id,
        name: "New project",
      },
    });
  }),
});
