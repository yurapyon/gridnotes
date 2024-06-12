"use client";

import { trpc } from "@/lib/trpc/trpc-client";
import { getQueryClient } from "@trpc/react-query/shared";

export const Xyz = () => {
  const utils = trpc.useUtils();
  const pages = trpc.pages.getPages.useQuery();
  console.log(pages);
  const createPageMutation = trpc.pages.createPage.useMutation({
    onSuccess: () => {
      utils.pages.getPages.invalidate();
    },
  });

  return (
    <div>
      <button
        className="bg-white text-black"
        onClick={() => createPageMutation.mutate()}
      >
        +
      </button>
      {pages.data?.map((page) => {
        return <div key={page.id}>{page.userId}</div>;
      })}
    </div>
  );
};
