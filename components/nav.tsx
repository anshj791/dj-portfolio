"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useContent } from "@/lib/content-store";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" }
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { data, isOwner } = useContent();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-[8px] border border-ink/10 bg-bone/72 px-4 py-3 shadow-sm backdrop-blur-xl">
        <Link href="/" className="font-display text-2xl text-ink">
          {data.owner.name}
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.22em] text-ink/70 transition hover:text-bronze"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={isOwner ? "/admin" : "/admin/login"}
            className="rounded-[6px] border border-ink/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ink/70 hover:border-bronze hover:text-bronze"
          >
            {isOwner ? "Dashboard" : "Owner"}
          </Link>
        </div>
        <button
          aria-label="Open navigation"
          className="button-focus md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open ? (
        <div className="mx-auto mt-2 grid w-full max-w-6xl gap-2 rounded-[8px] border border-ink/10 bg-bone p-3 shadow-luxury md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="px-2 py-3 text-sm uppercase tracking-[0.18em]" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/admin/login" className="px-2 py-3 text-sm uppercase tracking-[0.18em]" onClick={() => setOpen(false)}>
            Owner
          </Link>
        </div>
      ) : null}
    </header>
  );
}
