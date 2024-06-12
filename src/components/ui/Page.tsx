import { trpc } from "@/lib/trpc/trpc-client";

export const Page: React.FC<{ selectedPageId: string; className?: string }> = ({
  selectedPageId,
  className = "",
}) => {
  const { data: pages } = trpc.pages.getPages.useQuery();
  const currentPage = pages?.find((page) => page.id === selectedPageId);

  if (!currentPage) return;

  return (
    <div className={["relative", className].join(" ")}>
      {currentPage.textAreas.map((textArea) => {
        console.log(textArea);
        return (
          <div
            key={textArea.id}
            className="absolute flex flex-col text-black"
            style={{
              top: textArea.y + "em",
              left: textArea.x + "ch",
              width: textArea.width + "ch",
            }}
          >
            <div
              className="w-full"
              style={{
                backgroundColor: textArea.color || "#888888",
              }}
            >
              {textArea.id}
            </div>
            <div
              className="bg-slate-200"
              style={{ height: textArea.height + "em" }}
            >
              {textArea.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
