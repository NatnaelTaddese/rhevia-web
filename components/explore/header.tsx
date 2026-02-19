"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home02Icon,
  LibraryIcon,
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
    <header className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3">
        {/* Left: Navigation - Dynamic Island Style */}
        <nav className="flex h-11 items-center gap-0.5 rounded-full bg-black/80 px-1.5 backdrop-blur-xl shadow-xl ring-1 ring-white/20">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <HugeiconsIcon icon={link.icon} strokeWidth={2} className="size-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + User - Dynamic Island Style */}
        <div className="flex h-11 items-center gap-0.5 rounded-full bg-black/80 px-1.5 backdrop-blur-xl shadow-xl ring-1 ring-white/20">
          {/* Search Button */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
          </button>

          {/* User Avatar */}
          {isPending || !session?.user ? (
            <div className="size-9 animate-pulse rounded-full bg-white/20" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex size-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 focus:outline-none">
                  <Avatar size="sm" className="size-7 ring-[1.5px] ring-gradient-to-b ring-white/40 ring-offset-1 ring-offset-black/50">
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
