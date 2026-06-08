"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { AnimatedSection, GradientButton, HoverCard, SectionLabel } from "@/components/ui/aceternity";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/home-page";
import { OwnerToolbar } from "@/components/owner-toolbar";

export function ProjectsPage() {
  const { data } = useContent();
  const [category, setCategory] = useState("All");
  const categories = ["All", ...data.categories];
  const projects = useMemo(
    () => (category === "All" ? data.projects : data.projects.filter((project) => project.category === category)),
    [category, data.projects]
  );

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-28">
        <section className="section-shell py-16">
          <SectionLabel>Selected Works</SectionLabel>
          <h1 className="max-w-4xl font-display text-[clamp(4rem,10vw,9rem)] font-light leading-[0.82]">Project archive</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-ink/65">
            Residential, commercial, hospitality, entertainment, and renovation work rendered through a consistent design template.
          </p>
          <div className="mt-9 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`button-focus rounded-[8px] border px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${
                  category === item ? "border-ink bg-ink text-bone" : "border-ink/10 bg-bone text-ink/66 hover:border-bronze"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <AnimatedSection className="section-shell grid gap-5 pb-24 md:grid-cols-2">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.slug}>
              <HoverCard>
                <div className="relative h-80">
                  <Image src={project.heroImage || "/media/extra/1.png"} alt={project.title || project.slug} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-bronze">
                    {project.category} / {project.location}
                  </p>
                  <h2 className="mt-4 font-display text-4xl">{project.title}</h2>
                  <p className="mt-4 leading-7 text-ink/62">{project.summary}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-ink">
                    View Project <ArrowRight size={15} />
                  </span>
                </div>
              </HoverCard>
            </Link>
          ))}
        </AnimatedSection>
      </main>
      <Footer />
      <OwnerToolbar />
    </>
  );
}
