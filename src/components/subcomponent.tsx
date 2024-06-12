"use client";

import { trpc } from "@/lib/trpc/trpc-client";

export const Xyz = () => {
  const res = trpc.healthcheck.useQuery();
  console.log(res.data);
  const testing = trpc.testing.useQuery();
  console.log(testing.data);
  return <div>{res.isSuccess && res.data.toString()}</div>;
};
