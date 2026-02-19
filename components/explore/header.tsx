"use client";

import {
  Home02Icon,
  LibraryIcon,
  Logout03Icon,
  Tv01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home02Icon },
  { href: "/movies", label: "Movies", icon: LibraryIcon },
  { href: "/shows", label: "Shows", icon: Tv01Icon },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Auto sign in anonymously if no session
  useEffect(() => {
    if (!isPending && !session) {
      authClient.signIn.anonymous();
    }
  }, [isPending, session]);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">Rhevia</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-xs/relaxed font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <HugeiconsIcon icon={link.icon} strokeWidth={2} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-2">
          {isPending || !session?.user ? (
            // Loading state - shows placeholder to avoid flicker
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="relative flex size-8 items-center justify-center rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar size="sm">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || session.user.email}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase() ||
                        session.user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium">{session.user.name}</p>
                  <p className="text-[0.625rem] text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href="/profile"
                    className="flex w-full items-center gap-2"
                  >
                    <HugeiconsIcon icon={User02Icon} strokeWidth={2} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Logout03Icon} strokeWidth={2} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
