"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { useContent } from "@/lib/content-store";
import type { PortfolioData, Project } from "@/data/portfolio";
import { GradientButton, SectionLabel } from "@/components/ui/aceternity";
import { supabaseReady } from "@/lib/supabase";

function TextField({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink/58">
      {label}
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-28 rounded-[6px] border border-ink/10 bg-white px-4 py-3 normal-case tracking-normal text-ink" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-[6px] border border-ink/10 bg-white px-4 py-3 normal-case tracking-normal text-ink" />
      )}
    </label>
  );
}

function makeProject(): Project {
  const id = Date.now();
  return {
    slug: `new-project-${id}`,
    title: "New Project",
    category: "Residential",
    location: "Mumbai, India",
    year: "2026",
    summary: "A short project summary.",
    overview: "Describe the project brief, design intent, and final spatial experience.",
    heroImage: "/media/extra/1.png",
    duration: "3-6 Months",
    area: "1,000 sq ft",
    focus: "Interior Design",
    materials: ["Wood", "Stone", "Textiles"],
    gallery: [{ src: "/media/extra/1.png", alt: "Project image", label: "Hero View" }],
    drawings: [],
    details: [
      { title: "Design Concept", body: "Describe the central design concept." },
      { title: "Materials and Finishes", body: "List the key materials and finish choices." }
    ]
  };
}

export function AdminDashboard() {
  const router = useRouter();
  const { data, updateData, resetData, isOwner, authChecked } = useContent();
  const [draft, setDraft] = useState<PortfolioData>(data);
  const [activeProject, setActiveProject] = useState(0);
  const [publishMessage, setPublishMessage] = useState("");

  useEffect(() => {
    setDraft(data);
  }, [data]);

  useEffect(() => {
    if (authChecked && !isOwner) router.push("/admin/login");
  }, [authChecked, isOwner, router]);

  if (!authChecked || !isOwner) return null;

  const update = (next: PortfolioData) => setDraft(next);
  const project = draft.projects[activeProject];

  const uploadImage = (file: File, apply: (src: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => apply(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-[#f3eadf] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-ink/10 bg-bone p-4 shadow-sm">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-ink/60 hover:text-bronze">
              <ArrowLeft size={14} /> Site preview
            </Link>
            <h1 className="font-display text-5xl">CMS Dashboard</h1>
            <p className="mt-2 text-sm text-ink/58">
              Edits publish instantly to this browser. Supabase integration is {supabaseReady ? "connected" : "ready for credentials"}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GradientButton
              onClick={async () => {
                setPublishMessage("Publishing...");
                try {
                  await updateData(draft);
                  setPublishMessage("Published to Supabase. Other devices will load the update.");
                } catch (error) {
                  setPublishMessage(error instanceof Error ? error.message : "Publish failed");
                }
              }}
            >
              <Save className="mr-2" size={16} /> Save and publish
            </GradientButton>
            <button
              onClick={async () => {
                setPublishMessage("Resetting...");
                try {
                  await resetData();
                  setPublishMessage("Reset and published.");
                } catch (error) {
                  setPublishMessage(error instanceof Error ? error.message : "Reset failed");
                }
              }}
              className="button-focus rounded-[8px] border border-ink/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink/62 hover:border-clay hover:text-clay"
            >
              Reset
            </button>
          </div>
          {publishMessage ? (
            <p className="basis-full rounded-[6px] bg-white px-3 py-2 text-sm text-ink/68">
              {publishMessage}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="grid content-start gap-4">
            <section className="rounded-[8px] border border-ink/10 bg-bone p-5">
              <SectionLabel>Owner Profile</SectionLabel>
              <div className="grid gap-4">
                <TextField label="Name" value={draft.owner.name} onChange={(value) => update({ ...draft, owner: { ...draft.owner, name: value } })} />
                <TextField label="Studio" value={draft.owner.studio} onChange={(value) => update({ ...draft, owner: { ...draft.owner, studio: value } })} />
                <TextField label="Email" value={draft.owner.email} onChange={(value) => update({ ...draft, owner: { ...draft.owner, email: value } })} />
                <TextField label="Phone" value={draft.owner.phone} onChange={(value) => update({ ...draft, owner: { ...draft.owner, phone: value } })} />
                <TextField label="WhatsApp" value={draft.owner.whatsapp} onChange={(value) => update({ ...draft, owner: { ...draft.owner, whatsapp: value } })} />
                <TextField label="Location" value={draft.owner.location} onChange={(value) => update({ ...draft, owner: { ...draft.owner, location: value } })} />
              </div>
            </section>

            <section className="rounded-[8px] border border-ink/10 bg-bone p-5">
              <SectionLabel>Sections</SectionLabel>
              <p className="mb-4 text-sm leading-6 text-ink/58">Use these template sections in order. Content changes stay inside the layout system.</p>
              {["Hero", "About", "Projects", "Services", "Testimonials", "Process", "Contact"].map((item, index) => (
                <div key={item} className="mb-2 rounded-[6px] border border-ink/10 bg-white px-3 py-2 text-sm">
                  {index + 1}. {item}
                </div>
              ))}
            </section>
          </aside>

          <div className="grid gap-5">
            <section className="rounded-[8px] border border-ink/10 bg-bone p-5">
              <SectionLabel>Homepage Copy</SectionLabel>
              <div className="grid gap-4">
                <TextField label="Hero headline" value={draft.hero.headline} onChange={(value) => update({ ...draft, hero: { ...draft.hero, headline: value } })} />
                <TextField label="Hero description" multiline value={draft.hero.description} onChange={(value) => update({ ...draft, hero: { ...draft.hero, description: value } })} />
                <TextField label="About heading" value={draft.about.heading} onChange={(value) => update({ ...draft, about: { ...draft.about, heading: value } })} />
                <TextField label="About biography" multiline value={draft.about.bio.join("\n\n")} onChange={(value) => update({ ...draft, about: { ...draft.about, bio: value.split(/\n\s*\n/).filter(Boolean) } })} />
                <TextField label="Services description" multiline value={draft.services.description} onChange={(value) => update({ ...draft, services: { ...draft.services, description: value } })} />
              </div>
            </section>

            <section className="rounded-[8px] border border-ink/10 bg-bone p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <SectionLabel>Project Manager</SectionLabel>
                <button
                  onClick={() => {
                    const projects = [...draft.projects, makeProject()];
                    update({ ...draft, projects });
                    setActiveProject(projects.length - 1);
                  }}
                  className="button-focus inline-flex items-center gap-2 rounded-[8px] bg-ink px-4 py-3 text-xs uppercase tracking-[0.18em] text-bone"
                >
                  <Plus size={15} /> Add Project
                </button>
              </div>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                {draft.projects.map((item, index) => (
                  <button
                    key={item.slug}
                    onClick={() => setActiveProject(index)}
                    className={`button-focus shrink-0 rounded-[8px] border px-4 py-2 text-sm ${activeProject === index ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white"}`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {project ? (
                <div className="grid gap-5">
                  <div
                    className="relative grid min-h-64 place-items-center overflow-hidden rounded-[8px] border border-dashed border-ink/20 bg-white"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const file = event.dataTransfer.files[0];
                      if (file) {
                        uploadImage(file, (src) => {
                          const projects = [...draft.projects];
                          projects[activeProject] = { ...project, heroImage: src, gallery: [{ src, alt: project.title, label: "Uploaded Hero" }, ...project.gallery] };
                          update({ ...draft, projects });
                        });
                      }
                    }}
                  >
                    <Image src={project.heroImage} alt={project.title} fill className="object-cover opacity-70" />
                    <label className="relative z-10 inline-flex cursor-pointer items-center gap-2 rounded-[8px] bg-bone px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink shadow">
                      <ImagePlus size={15} /> Drag image or upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            uploadImage(file, (src) => {
                              const projects = [...draft.projects];
                              projects[activeProject] = { ...project, heroImage: src, gallery: [{ src, alt: project.title, label: "Uploaded Hero" }, ...project.gallery] };
                              update({ ...draft, projects });
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Title" value={project.title} onChange={(value) => {
                      const projects = [...draft.projects];
                      projects[activeProject] = { ...project, title: value };
                      update({ ...draft, projects });
                    }} />
                    <TextField label="Category" value={project.category} onChange={(value) => {
                      const projects = [...draft.projects];
                      projects[activeProject] = { ...project, category: value };
                      update({ ...draft, projects });
                    }} />
                    <TextField label="Location" value={project.location} onChange={(value) => {
                      const projects = [...draft.projects];
                      projects[activeProject] = { ...project, location: value };
                      update({ ...draft, projects });
                    }} />
                    <TextField label="Year" value={project.year} onChange={(value) => {
                      const projects = [...draft.projects];
                      projects[activeProject] = { ...project, year: value };
                      update({ ...draft, projects });
                    }} />
                  </div>
                  <TextField label="Summary" multiline value={project.summary} onChange={(value) => {
                    const projects = [...draft.projects];
                    projects[activeProject] = { ...project, summary: value };
                    update({ ...draft, projects });
                  }} />
                  <TextField label="Overview" multiline value={project.overview} onChange={(value) => {
                    const projects = [...draft.projects];
                    projects[activeProject] = { ...project, overview: value };
                    update({ ...draft, projects });
                  }} />
                  <TextField label="Materials, comma separated" value={project.materials.join(", ")} onChange={(value) => {
                    const projects = [...draft.projects];
                    projects[activeProject] = { ...project, materials: value.split(",").map((item) => item.trim()).filter(Boolean) };
                    update({ ...draft, projects });
                  }} />
                  <button
                    onClick={() => {
                      const projects = draft.projects.filter((_, index) => index !== activeProject);
                      update({ ...draft, projects });
                      setActiveProject(Math.max(0, activeProject - 1));
                    }}
                    className="button-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-clay/30 px-4 py-3 text-xs uppercase tracking-[0.18em] text-clay hover:bg-clay hover:text-white"
                  >
                    <Trash2 size={15} /> Delete project
                  </button>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
