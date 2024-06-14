import { Note } from "@prisma/client";
import { useState } from "react";

export const NoteComponent: React.FC<{ note: Note; className?: string }> = ({
  note,
  className = "",
}) => {
  const [localText, setLocalText] = useState(note.text || "");
  const lines = localText.split("\n");
  return (
    <div className={["w-full bg-blue-100", className].join(" ")}>
      <textarea
        className="w-full bg-transparent outline-none block"
        style={{ resize: "none", height: lines.length * 1.5 + "em" }}
        value={localText}
        onChange={(e) => {
          setLocalText(e.target.value);
        }}
      />
    </div>
  );
};
