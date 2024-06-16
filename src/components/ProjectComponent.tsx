import { RouterOutputs, trpc } from "@/lib/trpc/trpc-client";
import { NoteStatus } from "@prisma/client";
import { NoteComponent } from "./NoteComponent";
import React, { useEffect, useState } from "react";
import { TextBuffer, useTextEditor } from "@/lib/text-editor/TextEditor";
import { useEditorStore } from "./providers/EditorStoreProvider";

const ProjectView: React.FC<{
  project: NonNullable<RouterOutputs["projects"]["getByIdWithNotes"]>;
  className?: string;
}> = ({ project, className = "" }) => {
  const utils = trpc.useUtils();

  const addNoteMutation = trpc.notes.create.useMutation({
    onSuccess: () => {
      utils.projects.getByIdWithNotes.invalidate({ id: project.id });
    },
  });

  const { textEditor } = useTextEditor();

  const statusColumns: NoteStatus[] = ["Later", "UpNext"];
  return (
    <div className={["flex flex-row gap-[1ch]", className].join(" ")}>
      {statusColumns.map((statusColumn) => {
        const notes = project.notes.filter(
          (note) => note.status === statusColumn
        );
        return (
          <div className="flex flex-col" key={statusColumn}>
            <div className="w-full bg-black text-white">{statusColumn}</div>
            <div className="flex flex-col gap-[1.5em] w-[40ch]">
              {notes.map((note, i) => {
                return (
                  <NoteComponent
                    key={note.id}
                    className="min-h-[4.5em]"
                    note={note}
                    textEditor={textEditor.current}
                  />
                );
              })}
              <button
                onClick={() =>
                  addNoteMutation.mutate({
                    projectId: project.id,
                    status: statusColumn,
                  })
                }
              >
                +note
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ProjectComponent: React.FC<{
  projectId: string;
  className?: string;
}> = ({ projectId, className = "" }) => {
  const { isLoading, data: project } = trpc.projects.getByIdWithNotes.useQuery({
    id: projectId,
  });

  const setTextBuffers = useEditorStore((state) => state.setTextBuffers);
  const clearTextBuffers = useEditorStore((state) => state.clearTextBuffers);

  useEffect(() => {
    if (project) {
      setTextBuffers(
        new Map(
          project.notes.map((note) => {
            const textBuffer = { lines: note.text?.split("\n") || [] };
            return [note.id, textBuffer];
          })
        )
      );
    }

    return () => {
      clearTextBuffers();
    };
  }, [clearTextBuffers, project, setTextBuffers]);

  return isLoading ? (
    <div>loading</div>
  ) : (
    project && <ProjectView project={project} />
  );
};
