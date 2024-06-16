"use client";

import { ProjectComponent } from "@/components/ProjectComponent";
import { ProjectsBar } from "@/components/ProjectsBar";
import { useState } from "react";

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  return (
    <main className="w-screen h-screen font-mono bg-white text-black">
      <div className="flex flex-col w-full h-full">
        <div className="grow min-h-0">
          {selectedProjectId && (
            <ProjectComponent
              className="w-full h-full"
              projectId={selectedProjectId}
            />
          )}
        </div>
        <ProjectsBar
          className="w-full h-[1.5em]"
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
        />
      </div>
    </main>
  );
}
