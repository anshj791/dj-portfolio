"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { GradientButton } from "@/components/ui/aceternity";

export function AdminLogin() {
  const router = useRouter();
  const { login } = useContent();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form
        className="w-full max-w-md rounded-[8px] border border-ink/10 bg-bone p-6 shadow-luxury"
        onSubmit={async (event) => {
          event.preventDefault();
          if (await login(id, password)) {
            router.push("/admin");
          } else {
            setError("Invalid owner ID or password.");
          }
        }}
      >
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-ink text-bone">
          <Lock />
        </div>
        <h1 className="font-display text-5xl">Owner login</h1>
        <div className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm uppercase tracking-[0.18em] text-ink/60">
            Owner ID
            <input value={id} onChange={(event) => setId(event.target.value)} className="rounded-[6px] border border-ink/10 bg-white px-4 py-3 normal-case tracking-normal text-ink" />
          </label>
          <label className="grid gap-2 text-sm uppercase tracking-[0.18em] text-ink/60">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="rounded-[6px] border border-ink/10 bg-white px-4 py-3 normal-case tracking-normal text-ink"
            />
          </label>
          {error ? <p className="text-sm text-clay">{error}</p> : null}
          <GradientButton type="submit">Enter dashboard</GradientButton>
        </div>
      </form>
    </main>
  );
}
