"use client";

import { trpc } from "@/lib/trpc/trpc-client";
import { getQueryClient } from "@trpc/react-query/shared";
import { useSession } from "next-auth/react";

export const Xyz = () => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const pages = trpc.pages.getPages.useQuery();
  const createPageMutation = trpc.pages.createPage.useMutation({
    onSuccess: () => {
      utils.pages.getPages.invalidate();
    },
  });
  const createTextAreaMutation = trpc.pages.createTextArea.useMutation();

  return (
    <div>
      <button
        className="bg-white text-black"
        onClick={() =>
          createPageMutation.mutate({
            userId: session?.user.id || "",
            projectId: "project",
          })
        }
      >
        +______
      </button>

      {pages?.data && (
        <button
          className="bg-white text-black"
          onClick={() =>
            createTextAreaMutation.mutate({
              userId: session?.user.id || "",
              pageId: pages.data[0].id,
              width: 100,
              height: 10,
            })
          }
        >
          ------+
        </button>
      )}
      {pages.data?.map((page) => {
        return <div key={page.id}>{page.userId}</div>;
      })}
    </div>
  );
};
