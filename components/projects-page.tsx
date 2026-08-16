"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { AnimatedSection, GradientButton, HoverCard, SectionLabel } from "@/components/ui/aceternity";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/home-page";
import { OwnerToolbar } from "@/components/owner-toolbar";

export function ProjectsPage() {
  const { data } = useContent();
  const [category, setCategory] = useState("All");
  const insertedCategories = useMemo(
    () =>
      Array.from(
        new Set(
          data.projects
            .map((project) => project.category?.trim())
            .filter((item): item is string => Boolean(item))
        )
      ),
    [data.projects]
  );
  const categories = ["All", ...insertedCategories];
  const projects = useMemo(
    () => (category === "All" ? data.projects : data.projects.filter((project) => project.category === category)),
    [category, data.projects]
  );
  const categoryDescription = insertedCategories.length
    ? `${insertedCategories.join(", ")} work rendered through a consistent design template.`
    : "A curated archive of design work rendered through a consistent design template.";

  useEffect(() => {
    if (category !== "All" && !insertedCategories.includes(category)) {
      setCategory("All");
    }
  }, [category, insertedCategories]);

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-28">
        <section className="section-shell py-16">
          <SectionLabel>Selected Works</SectionLabel>
          <h1 className="max-w-4xl font-display text-[clamp(4rem,10vw,9rem)] font-light leading-[0.82]">Project archive</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-ink/65">
            {categoryDescription}
          </p>
          {insertedCategories.length ? (
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
          ) : null}
        </section>

        <AnimatedSection className="section-shell grid gap-5 pb-24 md:grid-cols-2">
          {projects.length ? (
            projects.map((project) => {
              const meta = [project.category, project.location].filter(Boolean).join(" / ");

              return (
                <Link href={`/projects/${project.slug}`} key={project.slug}>
                  <HoverCard>
                    <div className="relative h-80">
                      <Image src={project.heroImage || "/media/extra/1.png"} alt={project.title || project.slug} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <div className="p-6">
                      {meta ? <p className="text-xs uppercase tracking-[0.24em] text-bronze">{meta}</p> : null}
                      {project.title ? <h2 className="mt-4 font-display text-4xl">{project.title}</h2> : null}
                      {project.summary ? <p className="mt-4 leading-7 text-ink/62">{project.summary}</p> : null}
                      <span className="mt-7 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-ink">
                        View Project <ArrowRight size={15} />
                      </span>
                    </div>
                  </HoverCard>
                </Link>
              );
            })
          ) : (
            <div className="rounded-[8px] border border-ink/10 bg-bone p-8 md:col-span-2">
              <p className="text-lg text-ink/62">No projects have been added for this filter yet.</p>
            </div>
          )}
        </AnimatedSection>
      </main>
      <Footer />
      <OwnerToolbar />
    </>
  );
}
