"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home02Icon,
  Film01Icon,
  Tv01Icon,
  Search01Icon,
  Logout03Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Home02Icon },
  { href: "/movies", label: "Movies", icon: Film01Icon },
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
    <header className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3">
        {/* Left: Navigation - Dynamic Island Style */}
        <nav className="flex h-11 items-center gap-0.5 rounded-full bg-black/90 px-1 backdrop-blur-xl shadow-xl ring-2 ring-white/10 font-sf-pro">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white ring-2 ring-inset ring-white/10"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                <HugeiconsIcon
                  icon={link.icon}
                  strokeWidth={3}
                  fill={isActive ? "white" : ""}
                  className="size-4"
                />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + User - Dynamic Island Style */}
        <div className="flex h-11 items-center gap-0.5 rounded-full bg-black/90 px-1 backdrop-blur-xl shadow-xl ring-2 ring-white/10">
          {/* Search Button */}
          <Button variant="ghost" size="icon-sm" className="ml-1">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={3}
              className="size-4"
            />
          </Button>

          {/* User Avatar */}
          {isPending || !session?.user ? (
            <div className="size-8 animate-pulse rounded-full bg-white/20 mx-1" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon-sm" className="mx-1 focus:outline-none">
                  <Avatar size="default">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || session.user.email}
                    />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {session.user.name?.charAt(0).toUpperCase() ||
                        session.user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              {/*Dropdown Menu*/}
              {session?.user?.isAnonymous ? (
                <DropdownMenuContent align="end" className="mt-4 w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-white/60">
                      login to track your progress
                    </p>
                  </div>

                  <DropdownMenuItem>
                    <Link
                      href="/login"
                      className="flex w-full h-full items-center gap-2"
                    >
                      <HugeiconsIcon icon={Logout03Icon} strokeWidth={2} />
                      <span>Log In</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent align="end" className="mt-4 w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-white/60">
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

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    variant="destructive"
                  >
                    <HugeiconsIcon icon={Logout03Icon} strokeWidth={2} />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
