import { protectedProcedure, router } from "../trpc";

export const pageRouter = router({
  getPages: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.page.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        textAreas: true,
      },
    });
  }),
  createPage: protectedProcedure.mutation(async ({ ctx, input }) => {
    await ctx.prisma.page.create({
      data: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
