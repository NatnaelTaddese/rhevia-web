"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Page() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!session) {
    return (
      <div>
        Please <Link href="/login">sign in</Link>
      </div>
    );
  }

  return (
    <>
      <h1>{session?.user?.name}</h1>
      <h1>Explore</h1>
    </>
  );
}
