import { router } from "@/server/trpc/trpc";
import { noteRouter } from "./routers/note-router";
import { projectRouter } from "./routers/project-router";

export const appRouter = router({
  projects: projectRouter,
  notes: noteRouter,
});

export type AppRouter = typeof appRouter;
