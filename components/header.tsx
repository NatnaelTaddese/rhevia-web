"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, signIn, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Setting07Icon,
  Logout04Icon,
  Login02Icon,
} from "@hugeicons/core-free-icons";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv" },
  { label: "Library", href: "/library" },
];

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null | undefined;
  isAnonymous?: boolean;
}

interface Session {
  user: User;
}

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initSession = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data?.user) {
          setSession(data as Session);
        } else {
          const { data: signInData } = await signIn.anonymous({
            fetchOptions: {
              onSuccess: (ctx) => {
                setSession(ctx.data as Session);
              },
              onError: (ctx) => {
                console.error("Anonymous sign-in failed:", ctx.error);
              },
            },
          });

          if (signInData?.user) {
            setSession(signInData as Session);
          }
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [mounted]);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const isAnonymous = session?.user?.isAnonymous;
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Navigation */}
        <nav className="flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Avatar */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Spinner className="size-5" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar size="sm">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback>
                    {isAnonymous ? "A" : userInitials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {isAnonymous ? (
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/login")}>
                      <HugeiconsIcon
                        icon={Login02Icon}
                        strokeWidth={2}
                        className="mr-2 size-4"
                      />
                      Log in
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                ) : (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {session?.user?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session?.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push("/settings")}
                      >
                        <HugeiconsIcon
                          icon={Setting07Icon}
                          strokeWidth={2}
                          className="mr-2 size-4"
                        />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        variant="destructive"
                      >
                        <HugeiconsIcon
                          icon={Logout04Icon}
                          strokeWidth={2}
                          className="mr-2 size-4"
                        />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
