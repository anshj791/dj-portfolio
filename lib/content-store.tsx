"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { normalizePortfolioData, portfolioData, type PortfolioData } from "@/data/portfolio";

const CONTENT_KEY = "diya-portfolio-content";
type ContentContextValue = {
  data: PortfolioData;
  isOwner: boolean;
  authChecked: boolean;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateData: (next: PortfolioData) => Promise<void>;
  resetData: () => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(portfolioData);
  const [isOwner, setIsOwner] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONTENT_KEY);
    if (saved) setData(normalizePortfolioData(JSON.parse(saved)));
    fetch("/api/content")
      .then((response) => response.json())
      .then((content) => {
        if (content.data) {
          const normalized = normalizePortfolioData(content.data);
          setData(normalized);
          window.localStorage.setItem(CONTENT_KEY, JSON.stringify(normalized));
        }
      })
      .catch(() => {
        // Local cache remains the offline fallback.
      });
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((session) => setIsOwner(Boolean(session.isOwner)))
      .finally(() => setAuthChecked(true));
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      data,
      isOwner,
      authChecked,
      login: async (id, password) => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, password })
        });
        const ok = response.ok;
        if (ok) {
          setIsOwner(true);
          setAuthChecked(true);
        }
        return ok;
      },
      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setIsOwner(false);
        setAuthChecked(true);
      },
      updateData: async (next) => {
        const normalized = normalizePortfolioData(next);
        setData(normalized);
        window.localStorage.setItem(CONTENT_KEY, JSON.stringify(normalized));
        const response = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: normalized })
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Failed to publish content");
        }
      },
      resetData: async () => {
        setData(portfolioData);
        window.localStorage.removeItem(CONTENT_KEY);
        const response = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: portfolioData })
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Failed to reset content");
        }
      }
    }),
    [data, isOwner, authChecked]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
