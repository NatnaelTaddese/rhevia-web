"use client";

import {
  Cancel01Icon,
  Film01Icon,
  Home02Icon,
  Logout03Icon,
  Search01Icon,
  Tv01Icon,
  User02Icon,
  Eraser01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchResults } from "@/components/explore/search-results";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home02Icon },
  { href: "/movies", label: "Movies", icon: Film01Icon },
  { href: "/shows", label: "Shows", icon: Tv01Icon },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!isPending && !session) {
      authClient.signIn.anonymous();
    }
  }, [isPending, session]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <>
      <header className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 relative">
          <nav
            className={cn(
              "flex h-11 items-center gap-0.5 rounded-full bg-black/90 px-1 backdrop-blur-xl shadow-xl ring-2 ring-white/10 font-sf-pro shrink-0 transition-all",
              isSearchOpen ? "hidden" : "",
            )}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200 whitespace-nowrap",
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

          <div
            className={cn(
              "flex h-11 items-center rounded-full bg-black/90 px-1 backdrop-blur-xl shadow-xl ring-2 ring-white/10 font-sf-pro overflow-hidden",
              "transition-all duration-150 ease-out",
              !isSearchOpen
                ? "w-[86px]"
                : "w-[280px] sm:w-[360px] md:w-[420px]",
            )}
          >
            <div className="flex items-center justify-between w-full">
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                  <motion.div
                    key="searchBtn"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex items-center shrink-0"
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-1"
                      onClick={openSearch}
                    >
                      <HugeiconsIcon
                        icon={Search01Icon}
                        strokeWidth={3}
                        className="size-4"
                      />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="searchInput"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex items-center flex-1 min-w-0"
                  >
                    <HugeiconsIcon
                      icon={Search01Icon}
                      strokeWidth={3}
                      className="ml-3 size-4 text-white/60 shrink-0"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search movies and shows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 h-11 min-w-0 bg-transparent px-3 text-sm text-white placeholder:text-white/40 outline-none"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setSearchQuery("")}
                        className="shrink-0"
                      >
                        <HugeiconsIcon
                          icon={Eraser01Icon}
                          strokeWidth={3}
                          className="size-3 transform -scale-x-100"
                        />
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center shrink-0">
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.div
                      key="closeBtn"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={closeSearch}
                        className="ml-1"
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          strokeWidth={3}
                          className="size-4"
                        />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="avatar"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      {isPending || !session?.user ? (
                        <div className="size-8 animate-pulse rounded-full bg-white/20 mx-1" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="mx-1 flex focus:outline-none"
                            >
                              <Avatar size="default">
                                <AvatarImage
                                  src={session.user.image || undefined}
                                  alt={session.user.name || session.user.email}
                                />
                                <AvatarFallback className="bg-white/20 text-white text-xs ring-2 ring-inset ring-white/10">
                                  {session.user.name?.charAt(0).toUpperCase() ||
                                    session.user.email?.charAt(0).toUpperCase() ||
                                    "U"}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>

                          {session?.user?.isAnonymous ? (
                            <DropdownMenuContent
                              align="end"
                              className="mt-4 w-56"
                            >
                              <div className="px-3 py-2">
                                <p className="text-sm font-medium">
                                  {session.user.name}
                                </p>
                                <p className="text-xs text-white/60">
                                  login to track your progress
                                </p>
                              </div>

                              <DropdownMenuItem>
                                <Link
                                  href="/login"
                                  className="flex w-full h-full items-center gap-2"
                                >
                                  <HugeiconsIcon
                                    icon={Logout03Icon}
                                    strokeWidth={2}
                                  />
                                  <span>Log In</span>
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          ) : (
                            <DropdownMenuContent
                              align="end"
                              className="mt-4 w-56"
                            >
                              <div className="px-3 py-2">
                                <p className="text-sm font-medium">
                                  {session.user.name}
                                </p>
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
                                  <HugeiconsIcon
                                    icon={User02Icon}
                                    strokeWidth={2}
                                  />
                                  <span>Profile</span>
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={handleSignOut}
                                variant="destructive"
                              >
                                <HugeiconsIcon
                                  icon={Logout03Icon}
                                  strokeWidth={2}
                                />
                                <span>Sign out</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          )}
                        </DropdownMenu>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchResults
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        onClose={closeSearch}
      />
    </>
  );
}
