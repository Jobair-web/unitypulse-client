"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu, X, ChevronDown, PlusCircle, LayoutList, CheckCircle2, UserRound, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Avatar from "@/components/Avatar";
import Skeleton from "@/components/Skeleton";
import { CONTAINER } from "@/lib/constants";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
];

const MENU = [
  { href: "/events/create", label: "Create Event", icon: PlusCircle },
  { href: "/events/manage", label: "Manage Events", icon: LayoutList },
  { href: "/events/joined", label: "Joined Events", icon: CheckCircle2 },
  { href: "/profile", label: "My Profile", icon: UserRound },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef(null);

  // Hover opens the profile menu. A short close delay lets the cursor travel from the avatar to the menu.
  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 200);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await authClient.signOut();
    toast.success("You've been logged out", { description: "See you at the next drive!" });
    router.push("/");
    router.refresh();
  }

  const linkClass = (href) => {
    const active = pathname === href;
    return `relative px-1 py-2 text-sm font-medium transition-colors hover:text-base-content ${
      active ? "text-primary" : "text-muted-foreground"
    } after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-0.5 after:rounded-full after:bg-primary after:transition-all ${
      active ? "after:w-6" : "after:w-0 hover:after:w-3"
    }`;
  };

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/90 transition-shadow supports-[backdrop-filter]:bg-base-100/70 supports-[backdrop-filter]:backdrop-blur-xl data-[scrolled=true]:shadow-card"
    >
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-4`}>
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {isPending ? (
            <Skeleton className="size-9 rounded-full" />
          ) : user ? (
            <>
              <div
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
                onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false);
                }}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label={`Account menu for ${user.name}`}
                  data-tip={user.name}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="tooltip tooltip-left flex cursor-pointer items-center gap-1 rounded-full ring-2 ring-primary/30 transition hover:ring-primary focus-visible:ring-primary"
                >
                  <Avatar user={user} />
                  <ChevronDown className={`mr-1 hidden size-4 text-muted-foreground transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {menuOpen && (
                  /* pt-2 is a transparent bridge, so the cursor never leaves the hover area */
                  <div className="absolute right-0 top-full z-50 w-64 pt-2">
                    <ul role="menu" className="menu w-full rounded-2xl border border-base-300 bg-base-100 p-2 shadow-card-hover motion-safe:animate-fade-up">
                      <li className="pointer-events-none px-3 py-2">
                        <span className="block p-0">
                          <span className="block truncate font-semibold">{user.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">{user.email}</span>
                        </span>
                      </li>
                      {MENU.map(({ href, label, icon: Icon }) => (
                        <li key={href} role="none">
                          <Link
                            href={href}
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className="gap-3 rounded-xl px-3 py-2.5 hover:bg-primary/10 hover:text-primary"
                          >
                            <Icon className="size-4" /> {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-primary hidden h-11 rounded-full sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary h-11 rounded-full px-6">
              Login
            </Link>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-circle size-11 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <nav aria-label="Mobile" className={`${CONTAINER} grid gap-1 py-4`}>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-3 text-lg font-medium ${pathname === l.href ? "bg-primary/10 text-primary" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <>
                <div className="my-2 border-t border-base-300" />
                {MENU.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium">
                    <Icon className="size-5 text-primary" /> {label}
                  </Link>
                ))}
                <button onClick={handleLogout} className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-error">
                  <LogOut className="size-5" /> Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}