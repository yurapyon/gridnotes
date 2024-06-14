import { trpc } from "@/lib/trpc/trpc-client";
import { NoteStatus } from "@prisma/client";
import { NoteComponent } from "./NoteComponent";

export const ProjectComponent: React.FC<{
  projectId: string;
  className?: string;
}> = ({ projectId, className = "" }) => {
  const utils = trpc.useUtils();

  const { data: currentProject } = trpc.projects.getByIdWithNotes.useQuery({
    id: projectId,
  });

  const addNoteMutation = trpc.notes.create.useMutation({
    onSuccess: () => {
      utils.projects.getByIdWithNotes.invalidate({ id: projectId });
    },
  });

  const statusColumns: NoteStatus[] = ["Later", "UpNext"];
  return (
    currentProject && (
      <div className={["flex flex-row gap-[1ch]", className].join(" ")}>
        {statusColumns.map((statusColumn) => {
          const notes = currentProject.notes.filter(
            (note) => note.status === statusColumn
          );
          return (
            <div className="flex flex-col" key={statusColumn}>
              <div className="w-full bg-black text-white">{statusColumn}</div>
              <div className="flex flex-col gap-[1.5em] w-[40ch]">
                {notes.map((note) => {
                  return (
                    <NoteComponent
                      key={note.id}
                      className="min-h-[4.5em]"
                      note={note}
                    />
                  );
                })}
                <button
                  onClick={() =>
                    addNoteMutation.mutate({ projectId, status: statusColumn })
                  }
                >
                  +note
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};
