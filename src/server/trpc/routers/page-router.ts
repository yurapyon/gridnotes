import { z } from "zod";
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

  createPage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.userId) {
        return;
      }

      await ctx.prisma.page.create({
        data: {
          userId: ctx.session.user.id,
          name: "New page",
          projectId: input.projectId,
        },
      });
    }),

  createTextArea: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        pageId: z.string(),
        width: z.number(),
        height: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.userId) {
        return;
      }

      await ctx.prisma.textArea.create({
        data: {
          pageId: input.pageId,
          width: input.width,
          height: input.height,
          text: "",
          x: 0,
          y: 0,
          color: "white",
        },
      });
    }),
});
