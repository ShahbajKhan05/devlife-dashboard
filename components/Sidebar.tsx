"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FolderGit2,
  GitBranch,
  House,
  Menu,
  NotebookPen,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "Home", href: "/", Icon: House },
  { label: "About", href: "/about", Icon: UserRound },
  { label: "Projects", href: "/projects", Icon: FolderGit2 },
  { label: "GitHub", href: "/github", Icon: GitBranch },
  { label: "Skills", href: "/skills", Icon: Wrench },
  { label: "Experience", href: "/experience", Icon: BriefcaseBusiness },
  { label: "Daily log", href: "/daily-log", Icon: NotebookPen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openedAtPath, setOpenedAtPath] = useState<string | null>(null);
  const drawerOpen = openedAtPath === pathname;
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function closeMenuAndRestoreFocus() {
    setOpenedAtPath(null);
    menuButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      drawerRef.current
        ?.querySelector<HTMLElement>("[data-drawer-first]")
        ?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenedAtPath(null);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        ) ?? []
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function closeOnHistoryChange() {
      setOpenedAtPath(null);
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", closeOnHistoryChange);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", closeOnHistoryChange);
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E8DDBB] bg-[#FFFDF0] px-4 lg:hidden">
        <Link
          href="/"
          onClick={() => setOpenedAtPath(null)}
          className="inline-flex min-h-11 items-center gap-2 font-extrabold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-[#B08D35] text-sm font-black text-white">
            D
          </span>
          DevLife<span className="text-[#B08D35]">.</span>
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() =>
            setOpenedAtPath(drawerOpen ? null : pathname)
          }
          aria-label={drawerOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={drawerOpen}
          aria-controls="main-sidebar"
          className="grid size-11 place-items-center rounded-lg border border-[#E2D6AD] bg-white transition-colors hover:bg-[#F8F0C9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
        >
          {drawerOpen ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
        </button>
      </header>

      {drawerOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenuAndRestoreFocus}
          className="fixed inset-0 z-50 cursor-default bg-[#191919]/45 lg:hidden"
        />
      )}

      <aside
        ref={drawerRef}
        id="main-sidebar"
        aria-label="Main navigation"
        aria-modal={drawerOpen ? true : undefined}
        role={drawerOpen ? "dialog" : undefined}
        className={`fixed inset-y-0 left-0 z-[60] flex w-[280px] max-w-[calc(100vw-40px)] flex-col overflow-y-auto border-r border-[#E8DDBB] bg-[#FFFDF0] px-4 py-5 shadow-xl transition-transform duration-200 motion-reduce:transition-none lg:z-40 lg:w-60 lg:translate-x-0 lg:shadow-none ${
          drawerOpen ? "visible translate-x-0" : "invisible -translate-x-full lg:visible"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpenedAtPath(null)}
            className="inline-flex min-h-11 items-center gap-2 font-extrabold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-[#B08D35] text-sm font-black text-white">
              D
            </span>
            DevLife<span className="text-[#B08D35]">.</span>
          </Link>
          <button
            type="button"
            onClick={closeMenuAndRestoreFocus}
            aria-label="Close navigation"
            className="grid size-11 place-items-center rounded-lg text-[#625D4C] transition-colors hover:bg-[#F8F0C9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35] lg:hidden"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#E8DDBB] bg-[#FAF4D9] p-3">
          <div
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E8D69B] text-sm font-extrabold text-[#785C19]"
          >
            SK
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">Shahbaj Khan</p>
            <p className="truncate text-xs text-[#625D4C]">
              Computer Science graduate
            </p>
          </div>
        </div>

        <p className="mb-2 mt-6 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#80631F]">
          Portfolio
        </p>
        <nav aria-label="Primary" className="flex flex-col gap-1">
          {navigation.map(({ label, href, Icon }, index) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpenedAtPath(null)}
                aria-current={active ? "page" : undefined}
                data-drawer-first={index === 0 ? true : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35] ${
                  active
                    ? "bg-[#F5EBC0] text-[#785C19]"
                    : "text-[#625D4C] hover:bg-[#FAF4D9] hover:text-[#191919]"
                }`}
              >
                <Icon
                  aria-hidden="true"
                  className={active ? "text-[#80631F]" : "text-[#8A7C58]"}
                  size={19}
                />
                {label}
                {active && (
                  <span className="ml-auto size-1.5 rounded-full bg-[#B08D35]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <Link
            href="https://github.com/ShahbajKhan05"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpenedAtPath(null)}
            className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-[#E8DDBB] bg-[#FAF4D9] px-3 text-sm font-semibold text-[#625D4C] hover:bg-[#F5EBC0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <GitBranch aria-hidden="true" size={18} />
              <span className="truncate">ShahbajKhan05</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </aside>
    </>
  );
}
