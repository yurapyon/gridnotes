import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/server/trpc/trpc";
import { pageRouter } from "./routers/page-router";

export const appRouter = router({
  pages: pageRouter,
});

export type AppRouter = typeof appRouter;
