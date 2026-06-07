"use client";

import Link from "next/link";
import { Edit3, LogOut, ShieldCheck } from "lucide-react";
import { useContent } from "@/lib/content-store";

export function OwnerToolbar() {
  const { isOwner, logout } = useContent();

  if (!isOwner) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[8px] border border-ink/10 bg-ink px-3 py-2 text-bone shadow-luxury">
      <span className="hidden items-center gap-2 px-2 text-xs uppercase tracking-[0.18em] sm:flex">
        <ShieldCheck size={15} /> Owner mode
      </span>
      <Link
        href="/admin"
        className="button-focus inline-flex items-center gap-2 rounded-[6px] bg-bone px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-ink"
      >
        <Edit3 size={14} /> Edit
      </Link>
      <button
        onClick={logout}
        className="button-focus inline-flex items-center gap-2 rounded-[6px] px-3 py-2 text-xs uppercase tracking-[0.16em] text-bone/85 hover:bg-white/10"
      >
        <LogOut size={14} /> Logout
      </button>
    </div>
  );
}

export function EditLink({ href = "/admin" }: { href?: string }) {
  const { isOwner } = useContent();
  if (!isOwner) return null;
  return (
    <Link
      href={href}
      className="button-focus inline-flex items-center gap-2 rounded-[6px] border border-bronze/30 bg-bone/80 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-bronze backdrop-blur"
    >
      <Edit3 size={13} /> Edit
    </Link>
  );
}
