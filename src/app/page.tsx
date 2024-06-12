import { Xyz } from "@/components/subcomponent";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/*
      <Xyz />
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session.user?.name}</span>}
      </p>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className=""
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
       */}
    </main>
  );
}
