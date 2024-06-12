import { trpc } from "@/lib/trpc/trpc-client";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

export const PagesBar: React.FC<{
  selectedPageId: string | null;
  setSelectedPageId: Dispatch<SetStateAction<string | null>>;
}> = ({ selectedPageId, setSelectedPageId }) => {
  const utils = trpc.useUtils();
  const { data: session } = useSession();
  const { data: pages } = trpc.pages.getPages.useQuery();
  const createPageMutation = trpc.pages.createPage.useMutation({
    onSuccess: () => {
      utils.pages.getPages.invalidate();
    },
  });

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-row">
      {pages?.map((page) => {
        const selected = selectedPageId === page.id;
        return (
          <div
            key={page.id}
            className={[
              "text-blue-800 select-none min-w-[4ch] max-w-[12ch] whitespace-nowrap pr-[1ch]",
              selected
                ? "bg-white font-bold"
                : "bg-slate-300 hover:bg-slate-200 cursor-pointer",
            ].join(" ")}
            onClick={() => {
              if (!selected) {
                setSelectedPageId(page.id);
              }
            }}
          >
            {page.name || "Page"}
          </div>
        );
      })}
      <button
        // TODO
        className="text-white bg-black px-[1ch]"
        onClick={() => {
          createPageMutation.mutate({
            userId: session.user.id,
            projectId: "project",
          });
        }}
      >
        +
      </button>
    </div>
  );
};
