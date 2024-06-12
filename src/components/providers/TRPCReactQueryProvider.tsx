"use client";

import React, { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/lib/trpc/trpc-client";
import superjson from "superjson";

const determineUrl = () => {
  if (typeof window !== undefined) return "";
  if (process.env.VERCEL) return `https://gridnotes.vercel.app`;
  return `http://localhost:3000`;
};

export const TRPCReactQueryProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: determineUrl() + "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
