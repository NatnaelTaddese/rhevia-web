"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Film01Icon,
  Tv01Icon,
  LibraryIcon,
  Search01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSessionContext } from "@/components/session-provider";

const navLinks = [
  { href: "/", label: "Home", icon: Home01Icon },
  { href: "/movies", label: "Movies", icon: Film01Icon },
  { href: "/tv-shows", label: "TV Shows", icon: Tv01Icon },
  { href: "/library", label: "Library", icon: LibraryIcon },
];

function NavLink({
  href,
  label,
  icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof Home01Icon;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "text-foreground bg-muted"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <HugeiconsIcon icon={icon} size={18} />
      <span>{label}</span>
    </Link>
  );
}

function UserAvatar() {
  const { session, isPending } = useSessionContext();

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Avatar size="sm">
      {user?.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
      <AvatarFallback>{isPending ? "..." : initials}</AvatarFallback>
    </Avatar>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Mobile menu button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon-sm" className="md:hidden mr-2" />}
          >
            <HugeiconsIcon icon={Menu01Icon} size={18} />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  isActive={pathname === link.href}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop navigation - left side */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              isActive={pathname === link.href}
            />
          ))}
        </nav>

        {/* Right side - Search and Avatar */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search bar */}
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search..."
              className="w-32 pl-7 sm:w-40 lg:w-56"
            />
          </div>

          {/* User avatar */}
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
