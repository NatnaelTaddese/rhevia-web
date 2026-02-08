import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL! as string,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [anonymousClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
