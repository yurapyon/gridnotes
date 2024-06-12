"use client";

import { Page } from "@/components/ui/Page";
import { PagesBar } from "@/components/ui/PagesBar";
import { useState } from "react";

export default function Home() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  return (
    <main className="w-screen h-screen font-mono bg-slate-300">
      <div className="flex flex-col">
        <PagesBar
          selectedPageId={selectedPageId}
          setSelectedPageId={setSelectedPageId}
        />
        {selectedPageId && (
          <Page className="grow min-h-0" selectedPageId={selectedPageId} />
        )}
      </div>
    </main>
  );
}
