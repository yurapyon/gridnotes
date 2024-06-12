import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/server/trpc/trpc";

// import { todoRouter } from "./routes/todo";

export const appRouter = router({
  healthcheck: publicProcedure.query(({ ctx, input }) => {
    return "OK";
  }),
  testing: protectedProcedure.query(({ ctx, input }) => {
    return ctx.session.user.name;
  }),
  // todos: todoRouter,
});

export type AppRouter = typeof appRouter;
