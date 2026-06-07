"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { AnimatedSection, GradientButton, HoverCard, SectionLabel } from "@/components/ui/aceternity";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/home-page";
import { EditLink, OwnerToolbar } from "@/components/owner-toolbar";

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
                <SectionLabel>{project.category}</SectionLabel>
                <h1 className="font-display text-[clamp(4rem,9vw,8rem)] font-light leading-[0.84]">{project.title}</h1>
              </div>
              <EditLink />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Location", project.location],
                ["Year", project.year],
                ["Focus", project.focus]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[8px] border border-ink/10 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-bronze">{label}</p>
                  <p className="mt-2 text-ink/70">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <Image src={project.heroImage} alt={project.title} width={980} height={900} className="aspect-[5/4] rounded-[8px] object-cover shadow-luxury" priority />
        </section>

        <AnimatedSection className="section-shell grid gap-8 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionLabel>Project Overview</SectionLabel>
            <p className="font-display text-4xl leading-tight text-ink/85">{project.overview}</p>
          </div>
          <div className="grid gap-4">
            {[
              ["Project Duration", project.duration],
              ["Area", project.area],
              ["Materials", project.materials.join(", ")]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[8px] border border-ink/10 bg-bone p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-bronze">{label}</p>
                <p className="mt-3 leading-7 text-ink/70">{value}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="bg-[#ede1d2] py-20">
          <div className="section-shell">
            <SectionLabel>Image Gallery</SectionLabel>
            <div className="grid gap-5 md:grid-cols-2">
              {project.gallery.map((image) => (
                <HoverCard key={image.src}>
                  <Image src={image.src} alt={image.alt} width={900} height={720} className="h-[420px] w-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/75 to-transparent p-5 text-bone">
                    <p className="font-display text-3xl">{image.label}</p>
                  </div>
                </HoverCard>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section-shell py-20">
          <SectionLabel>Before / Plans / Technical Drawings</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            {project.drawings.map((image) => (
              <div key={image.src} className="rounded-[8px] border border-ink/10 bg-white p-4 shadow-sm">
                <Image src={image.src} alt={image.alt} width={900} height={650} className="h-auto w-full rounded-[6px] object-contain" />
                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-ink/58">{image.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="section-shell grid gap-5 py-12 md:grid-cols-3">
          {project.details.map((detail) => (
            <div key={detail.title} className="rounded-[8px] border border-ink/10 bg-bone p-6">
              <h2 className="font-display text-3xl">{detail.title}</h2>
              <p className="mt-4 leading-7 text-ink/62">{detail.body}</p>
            </div>
          ))}
        </AnimatedSection>

        {project.testimonial ? (
          <AnimatedSection className="bg-ink py-20 text-bone">
            <div className="section-shell">
              <div className="mb-8 flex gap-1 text-bronze">
                {Array.from({ length: project.testimonial.rating }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]">"{project.testimonial.quote}"</p>
              <p className="mt-8 text-sm uppercase tracking-[0.2em] text-bone/60">
                {project.testimonial.author} / {project.testimonial.role}
              </p>
            </div>
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
