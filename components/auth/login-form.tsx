"use client";
import { Film01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    await signIn.email({
      email,
      password,
      callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          const message =
            ctx?.error?.message ?? "We couldn't sign you in. Please try again.";
          setErrorMessage(message);
        },
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleEmailSignIn}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <HugeiconsIcon
                  icon={Film01Icon}
                  strokeWidth={2}
                  className="size-6"
                />
              </div>
              <span className="sr-only">Rhevia.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Rhevia.</h1>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="w-full">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                strokeWidth={2}
                className="size-4"
              />
              <AlertTitle>Sign-in failed</AlertTitle>
              <AlertDescription className="min-w-full">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <Field>
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={async () => {
                setErrorMessage(null);

                await signIn.social({
                  provider: "google",
                  callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
                  fetchOptions: {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onError: (ctx) => {
                      const message =
                        ctx?.error?.message ??
                        "Google sign-in failed. Please try again.";
                      setErrorMessage(message);
                    },
                  },
                });
              }}
            >
              {loading ? (
                <Spinner></Spinner>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <title>Google Logo</title>
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
              )}
              Continue with Google
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Field>
          <Field>
            <Button
              type="submit"
              disabled={
                loading || email.trim().length === 0 || password.length === 0
              }
            >
              {loading ? <Spinner></Spinner> : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </FieldDescription>
    </div>
  );
}
