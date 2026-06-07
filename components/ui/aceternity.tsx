"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function HoverCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 180, damping: 20 });

  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-[8px] luxury-border bg-bone shadow-luxury", className)}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,.34),transparent_36%)]" />
      {children}
    </motion.div>
  );
}

export function AnimatedSection({
  children,
  className,
  id
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-bronze">
      {children}
    </p>
  );
}

export function GradientButton({
  children,
  href,
  onClick,
  type = "button",
  className
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "button-focus inline-flex min-h-11 items-center justify-center rounded-[8px] bg-ink px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-bone transition hover:bg-bronze";
  if (href) {
    return (
      <a className={cn(base, className)} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={cn(base, className)} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
