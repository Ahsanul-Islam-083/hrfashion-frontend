import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    jwtClient(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export const getToken = async (): Promise<string | null> => {
  let token: string | null = null;
  await authClient.getSession({
    fetchOptions: {
      onSuccess: (context) => {
        token = context.response.headers.get("set-auth-jwt");
      },
    },
  });
  return token;
};
