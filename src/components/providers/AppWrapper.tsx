"use client";

import React, { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, httpLink, loggerLink } from "@trpc/client";
import { trpc } from "@/lib/trpc/trpc-client";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";

const determineUrl = () => {
  if (typeof window !== undefined) return "";
  if (process.env.VERCEL) return `https://gridnotes.vercel.app`;
  return `http://localhost:3000`;
};

export const AppWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          url: determineUrl() + "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <SessionProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
};
