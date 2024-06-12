"use client";

import { Page } from "@/components/ui/Page";
import { PagesBar } from "@/components/ui/PagesBar";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  return (
    <main className="w-screen h-screen font-mono bg-slate-300 text-black">
      <div className="flex flex-col">
        <PagesBar
          selectedPageId={selectedPageId}
          setSelectedPageId={setSelectedPageId}
        />
        <Page className="grow min-h-0 w-full" selectedPageId={selectedPageId} />
        {!session ? (
          <button onClick={() => signIn("discord")}>sign in</button>
        ) : (
          <div></div>
        )}
      </div>
    </main>
  );
}
