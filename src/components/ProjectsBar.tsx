import { trpc } from "@/lib/trpc/trpc-client";
import { Dispatch, SetStateAction, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export const ProjectsBar: React.FC<{
  selectedProjectId: string | null;
  setSelectedProjectId: Dispatch<SetStateAction<string | null>>;
  className?: string;
}> = ({ selectedProjectId, setSelectedProjectId, className = "" }) => {
  const { data: session } = useSession();

  const { data: projectMenuOptions } = trpc.projects.getMenuOptions.useQuery();

  const currentProjectMenuOption = projectMenuOptions?.find(
    (projectMenuOption) => projectMenuOption.id === selectedProjectId
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className={["flex flex-row bg-slate-700 text-white", className].join(" ")}
    >
      <div
        className="relative bg-black w-[16ch]"
        onClick={() => setDropdownOpen(true)}
      >
        <div className="">{currentProjectMenuOption?.name}</div>
        {dropdownOpen && (
          <div className="flex flex-col absolute bottom-full left-0 w-full h-[15em] bg-blue-500">
            {projectMenuOptions?.map((projectMenuOption) => {
              return (
                <div
                  key={projectMenuOption.id}
                  className="w-full hover:bg-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProjectId(projectMenuOption.id);
                    setDropdownOpen(false);
                  }}
                >
                  {projectMenuOption.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="grow" />
      {!session ? (
        <button onClick={() => signIn("discord")}>sign in</button>
      ) : (
        <button onClick={() => signOut()}>sign out</button>
      )}
    </div>
  );
};
