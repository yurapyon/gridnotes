import { TextBuffer, TextEditor } from "@/lib/text-editor/TextEditor";
import { Note } from "@prisma/client";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { useEditorStore } from "./providers/EditorStoreProvider";

export const NoteComponent: React.FC<{
  note: Note;
  textEditor: TextEditor;
  className?: string;
}> = ({ note, textEditor, className = "" }) => {
  const textBuffer = useEditorStore((state) => state.textBuffers.get(note.id));
  const editing = useEditorStore((state) => state.focusedNoteId === note.id);
  const focusNote = useEditorStore((state) => state.focusNote);
  const updateTextBuffer = useEditorStore((state) => state.updateTextBuffer);

  return (
    <div
      tabIndex={0}
      className="bg-gray-300 min-h-[6em]"
      onFocus={() => focusNote(note.id)}
      onKeyDown={(e) => {
        if (editing) {
          textEditor.onKeyDown(e);
        }
      }}
      onClick={() => updateTextBuffer(note.id)}
    >
      {textBuffer &&
        textBuffer.lines.map((line, i) => {
          return <div key={i}>{line}</div>;
        })}
    </div>
  );
};
