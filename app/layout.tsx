import type { Metadata } from "next";
import "./globals.css";
import { ContentProvider } from "@/lib/content-store";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Diya Jain Studio | Luxury Interior Designer",
  description:
    "A premium, interactive interior design portfolio for Diya Jain Studio, featuring residential, hospitality, commercial, and renovation work.",
  openGraph: {
    title: "Diya Jain Studio | Luxury Interior Designer",
    description: "Minimal, immersive interiors shaped by light, material, and intention.",
    images: ["/media/extra/1.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
