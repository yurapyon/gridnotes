"use client";

import { ProjectComponent } from "@/components/ProjectComponent";
import { ProjectsBar } from "@/components/ProjectsBar";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  return (
    <main className="w-screen h-screen font-mono bg-slate-300 text-black">
      <div className="flex flex-col w-full h-full">
        {/*
            {!session ? (
              <button onClick={() => signIn("discord")}>sign in</button>
            ) : (
              <div></div>
            )}
        */}
        {selectedProjectId && (
          <ProjectComponent
            className="grow min-h-0"
            projectId={selectedProjectId}
          />
        )}
        <ProjectsBar
          className="w-full h-[1.5em]"
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
        />
      </div>
    </main>
  );
}
