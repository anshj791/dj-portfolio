"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { AnimatedSection, GradientButton, HoverCard, SectionLabel } from "@/components/ui/aceternity";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/home-page";
import { EditLink, OwnerToolbar } from "@/components/owner-toolbar";
import { projectTechnicalGroups } from "@/data/portfolio";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { data } = useContent();
  const project = data.projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <>
        <Nav />
        <main className="section-shell min-h-screen pt-40">
          <h1 className="font-display text-6xl">Project not found</h1>
          <Link href="/projects" className="mt-6 inline-flex text-bronze">
            Back to projects
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="pt-28">
        <section className="section-shell grid gap-8 py-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-center">
            <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-ink/60 hover:text-bronze">
              <ArrowLeft size={15} /> Back to projects
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div>
                {project.category ? <SectionLabel>{project.category}</SectionLabel> : null}
                <h1 className="font-display text-[clamp(4rem,9vw,8rem)] font-light leading-[0.84]">{project.title}</h1>
                {project.subtitle ? <p className="mt-4 text-xl leading-tight text-ink/70">{project.subtitle}</p> : null}
              </div>
              <EditLink />
            </div>
            {[
              ["Location", project.location],
              ["Year", project.year],
              ["Completion Date", project.completionDate],
              ["Focus", project.focus]
            ].filter(([, value]) => Boolean(value)).length > 0 ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Location", project.location],
                  ["Year", project.year],
                  ["Completion Date", project.completionDate],
                  ["Focus", project.focus]
                ].filter(([, value]) => Boolean(value)).map(([label, value]) => (
                  <div key={label} className="rounded-[8px] border border-ink/10 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-bronze">{label}</p>
                    <p className="mt-2 text-ink/70">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <Image
            src={project.heroImage || "/media/extra/1.png"}
            alt={project.title || project.slug}
            width={980}
            height={900}
            className="aspect-[5/4] rounded-[8px] object-cover shadow-luxury"
            priority
          />
        </section>

        {project.overview ? (
          <AnimatedSection className="section-shell grid gap-8 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionLabel>Project Overview</SectionLabel>
              <p className="font-display text-4xl leading-tight text-ink/85">{project.overview}</p>
            </div>
            <div className="grid gap-4">
              {[
                ["Project Duration", project.duration],
                ["Area", project.area],
                ["Materials", project.materials?.length ? project.materials.join(", ") : ""]
              ].filter(([, value]) => Boolean(value)).map(([label, value]) => (
                <div key={label} className="rounded-[8px] border border-ink/10 bg-bone p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-bronze">{label}</p>
                  <p className="mt-3 leading-7 text-ink/70">{value}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        ) : null}

        {project.gallery?.length ? (
          <AnimatedSection className="bg-[#ede1d2] py-20">
            <div className="section-shell">
              <SectionLabel>Image Gallery</SectionLabel>
              <div className="grid gap-5 md:grid-cols-2">
                {project.gallery.map((image) => (
                  <HoverCard key={`${image.src}-${image.label}`}>
                    <Image src={image.src} alt={(image.alt ?? image.label) || image.src} width={900} height={720} className="h-[420px] w-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/75 to-transparent p-5 text-bone">
                      {image.label ? <p className="font-display text-3xl">{image.label}</p> : null}
                      {image.caption ? <p className="mt-2 text-sm text-bone/80">{image.caption}</p> : null}
                    </div>
                  </HoverCard>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ) : null}

        {projectTechnicalGroups(project).length ? (
          <AnimatedSection className="section-shell py-20">
            <SectionLabel>Before / Plans / Technical Drawings</SectionLabel>
            <div className="grid gap-5 md:grid-cols-2">
              {projectTechnicalGroups(project).map((group) => (
                <div key={group.key} className="rounded-[8px] border border-ink/10 bg-white p-4 shadow-sm">
                  <h2 className="font-display text-2xl">{group.title}</h2>
                  <div className="mt-5 grid gap-4">
                    {group.images.map((image, index) => (
                      <div key={`${image.src}-${index}`} className="rounded-[8px] overflow-hidden border border-ink/10 bg-[#fbf6f0]">
                        <Image src={image.src} alt={(image.alt ?? image.label) || image.src} width={900} height={650} className="h-auto w-full object-contain" />
                        <div className="p-4">
                          {image.label ? <p className="text-sm uppercase tracking-[0.18em] text-ink/58">{image.label}</p> : null}
                          {image.description ? <p className="mt-2 text-ink/70">{image.description}</p> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        ) : null}

        {project.details?.length ? (
          <AnimatedSection className="section-shell grid gap-5 py-12 md:grid-cols-3">
            {project.details.map((detail) => (
              <div key={detail.title} className="rounded-[8px] border border-ink/10 bg-bone p-6">
                <h2 className="font-display text-3xl">{detail.title}</h2>
                <p className="mt-4 leading-7 text-ink/62">{detail.body}</p>
              </div>
            ))}
          </AnimatedSection>
        ) : null}

        <section className="section-shell py-20 text-center">
          <h2 className="font-display text-[clamp(3rem,7vw,5.5rem)] font-light leading-none">Ready to start your project?</h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-ink/62">Let's discuss how to create a beautiful, functional space tailored to your needs.</p>
          <div className="mt-8 flex justify-center gap-3">
            <GradientButton href="/#contact">Get in touch</GradientButton>
            <GradientButton href="/projects" className="bg-bronze hover:bg-ink">More projects</GradientButton>
          </div>
        </section>
      </main>
      <Footer />
      <OwnerToolbar />
    </>
  );
}
