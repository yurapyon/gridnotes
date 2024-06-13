import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { NoteStatus } from "@prisma/client";

export const noteRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.create({
        data: {
          projectId: input.projectId,
        },
      });
    }),

  setText: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        newText: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.update({
        where: {
          project: {
            userId: ctx.session.user.id,
          },
          id: input.noteId,
        },
        data: {
          text: input.newText,
        },
      });
    }),

  setStatus: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        newStatus: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const status = input.newStatus as NoteStatus;

      let completedAt: Date | null = null;
      if (status === "Finished") {
        completedAt = new Date();
      }

      await ctx.prisma.note.update({
        where: {
          project: {
            userId: ctx.session.user.id,
          },
          id: input.noteId,
        },
        data: {
          status: status,
          completedAt: completedAt,
        },
      });
    }),
});
