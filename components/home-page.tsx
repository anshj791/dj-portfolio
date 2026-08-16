"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { AnimatedSection, GradientButton, HoverCard, SectionLabel } from "@/components/ui/aceternity";
import { HeroScene } from "@/components/hero-scene";
import { Nav } from "@/components/nav";
import { EditLink, OwnerToolbar } from "@/components/owner-toolbar";

export function HomePage() {
  const { data } = useContent();
  const featured = data.projects.slice(0, 4);
  const hasWork = Boolean(data.projects.length);
  const hasServices = Boolean(data.services?.items?.length);

  const whatsappLink = data.owner.whatsapp ? `https://wa.me/${data.owner.whatsapp.replace(/[^0-9]/g, "")}` : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "InteriorDesignService",
    name: data.owner.studio,
    founder: data.owner.name,
    email: data.owner.email,
    telephone: data.owner.phone,
    address: data.owner.location,
    areaServed: "India",
    sameAs: data.owner.socials.map((item) => item.href)
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Nav />
      <main>
        <section className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28">
          <div className="section-shell grid min-h-[calc(100vh-9rem)] items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
              <div className="mb-6 inline-flex rounded-[8px] border border-ink/10 bg-bone/70 px-3 py-2 text-xs uppercase tracking-[0.22em] text-ink/60">
                {data.owner.studio}
              </div>
              <h1 className="max-w-3xl font-display text-[clamp(4rem,11vw,9.5rem)] font-light leading-[0.82] text-ink">
                {data.hero.headline}
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-ink/68">{data.hero.description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <GradientButton href="#work">
                  {data.hero.cta} <ArrowRight className="ml-3" size={16} />
                </GradientButton>
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    className="button-focus inline-flex min-h-11 items-center rounded-[8px] border border-ink/12 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-ink transition hover:border-bronze hover:text-bronze"
                  >
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </motion.div>
            <div className="relative h-[52vh] min-h-[420px] overflow-hidden rounded-[8px] border border-ink/10 bg-[#e8dccd] shadow-luxury lg:h-[76vh]">
              <HeroScene />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/30 to-transparent p-5 text-bone">
                <span className="text-xs uppercase tracking-[0.22em]">Interactive 3D study</span>
                <span className="text-xs uppercase tracking-[0.22em]">Light / Material / Flow</span>
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-ink/10 bg-ink py-5 text-bone">
          <div className="hide-scrollbar flex gap-10 overflow-x-auto whitespace-nowrap px-4 text-sm uppercase tracking-[0.24em] text-bone/76">
            {["Residential Design", "Commercial Spaces", "Hospitality", "Renovation", "3D Visualization", "Space Planning"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <AnimatedSection id="about" className="section-shell grid gap-10 py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative">
            <Image
              src="/media/extra/4.png"
              alt={`${data.owner.name} portrait`}
              width={860}
              height={980}
              className="aspect-[4/5] rounded-[8px] object-cover shadow-luxury"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between gap-4">
              <SectionLabel>{data.about.label}</SectionLabel>
              <EditLink />
            </div>
            <h2 className="font-display text-[clamp(3rem,7vw,6.2rem)] font-light leading-[0.9]">{data.about.heading}</h2>
            <div className="mt-8 grid gap-5 text-lg leading-8 text-ink/68">
              {data.about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[data.about.education, data.about.school].map((item) => (
                <div key={item} className="rounded-[8px] border border-ink/10 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-bronze">Foundation</p>
                  <p className="mt-3 font-display text-2xl">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {hasWork ? (
          <AnimatedSection id="work" className="bg-[#ede1d2] py-24">
            <div className="section-shell">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <SectionLabel>Selected Work</SectionLabel>
                  <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-light leading-none">Recent projects</h2>
                </div>
                <div className="flex gap-3">
                  <EditLink />
                  <GradientButton href="/projects">View all projects</GradientButton>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {featured.map((project, index) => (
                  <Link href={`/projects/${project.slug}`} key={project.slug}>
                    <HoverCard className={index === 0 ? "md:row-span-2" : ""}>
                      <Image
                        src={project.heroImage || "/media/extra/1.png"}
                        alt={project.title || project.slug}
                        width={900}
                        height={900}
                        className="h-[390px] w-full object-cover md:h-full"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-bone">
                        <p className="text-xs uppercase tracking-[0.22em] text-bone/75">
                          {project.category}{project.location ? ` / ${project.location}` : ""}
                        </p>
                        <h3 className="mt-2 font-display text-4xl">{project.title}</h3>
                      </div>
                    </HoverCard>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ) : null}

        {hasServices ? (
          <AnimatedSection id="services" className="section-shell py-24">
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <SectionLabel>What We Offer</SectionLabel>
                <h2 className="font-display text-[clamp(3rem,7vw,5.8rem)] font-light leading-none">{data.services.title}</h2>
              </div>
              <p className="self-end text-lg leading-8 text-ink/65">{data.services.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.services.items.map((service, index) => (
                <HoverCard key={`${service.title}-${index}`} className="p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-bronze">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-8 font-display text-3xl">{service.title}</h3>
                  <p className="mt-4 leading-7 text-ink/62">{service.description}</p>
                </HoverCard>
              ))}
            </div>
          </AnimatedSection>
        ) : null}

        {/* Testimonials and How We Work sections removed per CMS preference. */}

        <AnimatedSection id="contact" className="bg-[#e5d6c3] py-24">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionLabel>Begin a Conversation</SectionLabel>
              <h2 className="font-display text-[clamp(3rem,7vw,5.8rem)] font-light leading-none">Let's create something extraordinary</h2>
              <div className="mt-8 grid gap-4 text-ink/70">
                <a className="flex items-center gap-3" href={`mailto:${data.owner.email}`}><Mail size={18} /> {data.owner.email}</a>
                <a className="flex items-center gap-3" href={`tel:${data.owner.phone}`}><Phone size={18} /> {data.owner.phone}</a>
                {whatsappLink ? (
                  <a className="flex items-center gap-3" href={whatsappLink}><MessageCircle size={18} /> WhatsApp inquiry</a>
                ) : null}
                <span className="flex items-center gap-3"><MapPin size={18} /> {data.owner.location}</span>
              </div>
              {/* Location map removed as requested */}
            </div>
            <form className="glass-panel grid gap-4 rounded-[8px] p-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="rounded-[6px] border border-ink/10 bg-bone px-4 py-3" placeholder="First name" />
                <input className="rounded-[6px] border border-ink/10 bg-bone px-4 py-3" placeholder="Last name" />
              </div>
              <input className="rounded-[6px] border border-ink/10 bg-bone px-4 py-3" placeholder="Email address" type="email" />
              <select className="rounded-[6px] border border-ink/10 bg-bone px-4 py-3">
                {data.services.items.map((service) => (
                  <option key={service.title}>{service.title}</option>
                ))}
              </select>
              <textarea className="min-h-40 rounded-[6px] border border-ink/10 bg-bone px-4 py-3" placeholder="Share your vision, timeline, and project details" />
              <GradientButton type="submit">Send Enquiry</GradientButton>
            </form>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
      <OwnerToolbar />
    </>
  );
}

export function Footer() {
  const { data } = useContent();
  return (
    <footer className="flex flex-wrap items-center justify-between gap-5 bg-ink px-6 py-8 text-bone">
      <span className="font-display text-3xl">{data.owner.name}</span>
      <span className="text-xs uppercase tracking-[0.18em] text-bone/55">© 2026 {data.owner.studio}. All rights reserved.</span>
      <div className="flex gap-5 text-sm text-bone/70">
        {data.owner.socials.map((item) => (
          <a key={item.label} href={item.href} className="hover:text-bone">
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
