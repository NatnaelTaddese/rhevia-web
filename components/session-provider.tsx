"use client";

import * as React from "react";
import { authClient, useSession } from "@/lib/auth-client";

interface SessionContextType {
  session: ReturnType<typeof useSession>["data"];
  isPending: boolean;
  error: ReturnType<typeof useSession>["error"];
}

const SessionContext = React.createContext<SessionContextType | undefined>(
  undefined
);

export function useSessionContext() {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = useSession();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  React.useEffect(() => {
    // If not pending and no session, sign in anonymously
    if (!isPending && !session && !isSigningIn) {
      setIsSigningIn(true);
      authClient.signIn
        .anonymous()
        .then(() => {
          setIsSigningIn(false);
        })
        .catch((err) => {
          console.error("Anonymous sign in failed:", err);
          setIsSigningIn(false);
        });
    }
  }, [isPending, session, isSigningIn]);

  const value = React.useMemo(
    () => ({
      session,
      isPending: isPending || isSigningIn,
      error,
    }),
    [session, isPending, isSigningIn, error]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
