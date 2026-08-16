"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { useContent } from "@/lib/content-store";
import type { ImageAsset, PortfolioData, ProcessStep, Project, ServiceItem, TestimonialItem } from "@/data/portfolio";
import { GradientButton, SectionLabel } from "@/components/ui/aceternity";
import { supabaseReady } from "@/lib/supabase";

function UploadSpinner() {
  return (
    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink/58">
      {label}
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-28 rounded-[6px] border border-ink/10 bg-white px-4 py-3 normal-case tracking-normal text-ink"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-[6px] border border-ink/10 bg-white px-4 py-3 normal-case tracking-normal text-ink"
        />
      )}
    </label>
  );
}

function makeProject(): Project {
  const id = Date.now();
  return {
    slug: `new-project-${id}`,
    title: "New Project",
    subtitle: "",
    category: "Residential",
    location: "Mumbai, India",
    year: "2026",
    completionDate: "",
    summary: "A short project summary.",
    overview: "Describe the project brief, design intent, and final spatial experience.",
    heroImage: "/media/extra/1.png",
    duration: "3-6 Months",
    area: "1,000 sq ft",
    focus: "Interior Design",
    materials: ["Wood", "Stone", "Textiles"],
    gallery: [{ src: "/media/extra/1.png", alt: "Project image", label: "Hero View", caption: "Final project view", description: "A polished snapshot of the completed design." }],
    drawings: [],
    technical: {
      before: [],
      floorPlans: [],
      technicalDrawings: [],
      renders: [],
      concepts: []
    },
    seo: {
      title: "",
      description: "",
      keywords: ""
    },
    details: [
      { title: "Design Concept", body: "Describe the central design concept." },
      { title: "Materials and Finishes", body: "List the key materials and finish choices." }
    ]
  };
}

function makeService(): ServiceItem {
  return { title: "New service", description: "Describe the service offering.", icon: "", featured: false };
}

function makeTestimonial(): TestimonialItem {
  return { quote: "Client feedback goes here.", author: "Client Name", role: "Client Role", company: "", image: "", rating: 5 };
}

function makeProcessStep(index: number): ProcessStep {
  return { stepNumber: String(index + 1).padStart(2, "0"), title: "New step", description: "Describe this stage of the process.", icon: "", image: "" };
}

export function AdminDashboard() {
  const router = useRouter();
  const { data, updateData, resetData, isOwner, authChecked } = useContent();
  const [draft, setDraft] = useState<PortfolioData>(data);
  const [activeProject, setActiveProject] = useState(0);
  const [activeProjectTab, setActiveProjectTab] = useState("General");
  const [publishMessage, setPublishMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(data);
  }, [data]);

  useEffect(() => {
    if (authChecked && !isOwner) router.push("/admin/login");
  }, [authChecked, isOwner, router]);

  if (!authChecked || !isOwner) return null;

  const update = (next: PortfolioData) => setDraft(next);
  const project = draft.projects[activeProject];

  const reorderArray = <T,>(array: T[], from: number, to: number) => {
    const next = [...array];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  };

  const createImageAsset = (src: string, alt = project?.title ?? "", label = "") => ({ src, alt, label, caption: "", description: "" });

  const uploadImage = async (file: File) => {
    setUploadMessage(`Uploading ${file.name}...`);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.url) {
      throw new Error(payload?.error || "Image upload failed");
    }

    return String(payload.url);
  };

  const uploadImages = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    const urls: string[] = [];
    setIsUploading(true);

    try {
      for (const [index, file] of fileList.entries()) {
        setUploadMessage(`Uploading ${index + 1} of ${fileList.length}: ${file.name}`);
        urls.push(await uploadImage(file));
      }

      setUploadMessage(`${urls.length} image${urls.length === 1 ? "" : "s"} uploaded.`);
      return urls;
    } finally {
      setIsUploading(false);
    }
  };

  const updateProject = (next: Project) => {
    const projects = [...draft.projects];
    projects[activeProject] = next;
    update({ ...draft, projects });
  };

  const moveProject = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= draft.projects.length || to >= draft.projects.length) return;

    const projects = reorderArray(draft.projects, from, to);
    update({ ...draft, projects });

    if (activeProject === from) {
      setActiveProject(to);
    } else if (from < activeProject && to >= activeProject) {
      setActiveProject(activeProject - 1);
    } else if (from > activeProject && to <= activeProject) {
      setActiveProject(activeProject + 1);
    }
  };

  const updateProjectField = (patch: Partial<Project>) => {
    if (!project) return;
    updateProject({ ...project, ...patch });
  };

  const setProjectArray = <K extends keyof Project>(key: K, value: Project[K]) => {
    if (!project) return;
    updateProject({ ...project, [key]: value });
  };

  const updateService = (index: number, next: ServiceItem) => {
    const items = [...draft.services.items];
    items[index] = next;
    update({ ...draft, services: { ...draft.services, items } });
  };

  const updateTestimonial = (index: number, next: TestimonialItem) => {
    const testimonials = [...draft.testimonials];
    testimonials[index] = next;
    update({ ...draft, testimonials });
  };

  const updateProcess = (index: number, next: ProcessStep) => {
    const process = [...draft.process];
    process[index] = next;
    update({ ...draft, process });
  };

  const renderImageManager = (label: string, images: ImageAsset[], onChange: (next: ImageAsset[]) => void) => {
    const inputId = `image-upload-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    return (
    <section className="rounded-[8px] border border-ink/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <p className="text-sm text-ink/60">Click to select multiple images, drag & drop, or reorder and edit captions.</p>
        </div>
        <label
          htmlFor={inputId}
          className={`button-focus inline-flex items-center gap-2 rounded-[8px] border border-bronze bg-bronze/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-bronze transition hover:bg-bronze hover:text-bone ${
            isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"
          }`}
        >
          {isUploading ? <UploadSpinner /> : <ImagePlus size={16} />}
          <span>{isUploading ? "Uploading..." : "+ Select Images"}</span>
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={isUploading}
          onChange={async (event) => {
            const files = event.target.files;
            if (!files) return;
            try {
              const sources = await uploadImages(files);
              onChange([...images, ...sources.map((src) => createImageAsset(src, project?.title ?? "", ""))]);
            } catch (error) {
              setUploadMessage(error instanceof Error ? error.message : "Image upload failed");
            } finally {
              event.target.value = "";
            }
          }}
        />
      </div>
      <div
        className={`group relative overflow-hidden rounded-[8px] border border-dashed border-ink/30 p-8 text-center text-sm text-ink/60 ${
          isUploading ? "bg-bronze/5" : ""
        }`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={async (event) => {
          event.preventDefault();
          if (isUploading) return;
          const files = event.dataTransfer.files;
          if (!files.length) return;
          try {
            const sources = await uploadImages(files);
            onChange([...images, ...sources.map((src) => createImageAsset(src, project?.title ?? "", ""))]);
          } catch (error) {
            setUploadMessage(error instanceof Error ? error.message : "Image upload failed");
          }
        }}
      >
        {isUploading ? (
          <span className="inline-flex items-center gap-2 text-bronze">
            <UploadSpinner /> Uploading images to media library...
          </span>
        ) : (
          "Drag images here or click to upload"
        )}
        {isUploading ? <span className="absolute inset-x-0 bottom-0 h-1 animate-pulse bg-bronze" /> : null}
      </div>
      <div className="mt-5 grid gap-4">
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`} className="grid gap-3 rounded-[8px] border border-ink/10 p-4">
            <div className="grid gap-3 sm:grid-cols-[96px_1fr]">
              <div className="relative h-24 w-full overflow-hidden rounded-[8px] bg-[#f8f1e8]">
                <img src={image.src} alt={image.alt || label} className="h-full w-full object-cover" />
              </div>
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">Image {index + 1}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onChange(reorderArray(images, index, index - 1))}
                      className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => onChange(reorderArray(images, index, index + 1))}
                      className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}
                      className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-clay/30 bg-white text-clay"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <input
                  value={image.label ?? ""}
                  placeholder="Label"
                  onChange={(event) => {
                    const next = [...images];
                    next[index] = { ...next[index], label: event.target.value };
                    onChange(next);
                  }}
                  className="rounded-[6px] border border-ink/10 bg-bone px-4 py-3 text-ink"
                />
                <input
                  value={image.caption ?? ""}
                  placeholder="Caption"
                  onChange={(event) => {
                    const next = [...images];
                    next[index] = { ...next[index], caption: event.target.value };
                    onChange(next);
                  }}
                  className="rounded-[6px] border border-ink/10 bg-bone px-4 py-3 text-ink"
                />
                <textarea
                  value={image.description ?? ""}
                  placeholder="Description"
                  onChange={(event) => {
                    const next = [...images];
                    next[index] = { ...next[index], description: event.target.value };
                    onChange(next);
                  }}
                  className="min-h-28 rounded-[6px] border border-ink/10 bg-bone px-4 py-3 text-ink"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    );
  };

  return (
    <main className="min-h-screen bg-[#f3eadf] px-4 py-8">
      <div className="mx-auto max-w-7xl">
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
          {uploadMessage ? (
            <p className="basis-full rounded-[6px] bg-bronze/10 px-3 py-2 text-sm text-bronze">
              <span className="inline-flex items-center gap-2">
                {isUploading ? <UploadSpinner /> : null}
                {uploadMessage}
              </span>
            </p>
          ) : null}
        </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="grid content-start gap-4">
            <section className="rounded-[8px] border border-ink/10 bg-bone p-5">
              <SectionLabel>Owner Profile</SectionLabel>
              <div className="grid gap-4">
                <TextField label="Name" value={draft.owner.name ?? ""} onChange={(value) => update({ ...draft, owner: { ...draft.owner, name: value } })} />
                <TextField label="Studio" value={draft.owner.studio ?? ""} onChange={(value) => update({ ...draft, owner: { ...draft.owner, studio: value } })} />
                <TextField label="Email" value={draft.owner.email ?? ""} onChange={(value) => update({ ...draft, owner: { ...draft.owner, email: value } })} />
                <TextField label="Phone" value={draft.owner.phone ?? ""} onChange={(value) => update({ ...draft, owner: { ...draft.owner, phone: value } })} />
                <TextField label="WhatsApp" value={draft.owner.whatsapp ?? ""} onChange={(value) => update({ ...draft, owner: { ...draft.owner, whatsapp: value } })} />
                <TextField label="Location" value={draft.owner.location ?? ""} onChange={(value) => update({ ...draft, owner: { ...draft.owner, location: value } })} />
              </div>
            </section>

            <section className="rounded-[8px] border border-ink/10 bg-bone p-5">
              <SectionLabel>Homepage Sections</SectionLabel>
              <p className="mb-4 text-sm leading-6 text-ink/58">These sections render only when content exists.</p>
              {[
                "Hero",
                "About",
                "Projects",
                "Services",
                "Testimonials",
                "Process",
                "Contact"
              ].map((item, index) => (
                <div key={item} className="mb-2 rounded-[6px] border border-ink/10 bg-white px-3 py-2 text-sm">
                  {index + 1}. {item}
                </div>
              ))}
            </section>
          </aside>

          <div className="grid gap-5">
            <section className="rounded-[8px] border border-ink/10 bg-bone p-5">
              <SectionLabel>Homepage Content</SectionLabel>
              <div className="grid gap-4">
                <TextField label="Hero headline" value={draft.hero.headline ?? ""} onChange={(value) => update({ ...draft, hero: { ...draft.hero, headline: value } })} />
                <TextField label="Hero description" multiline value={draft.hero.description ?? ""} onChange={(value) => update({ ...draft, hero: { ...draft.hero, description: value } })} />
                <TextField label="Hero CTA" value={draft.hero.cta ?? ""} onChange={(value) => update({ ...draft, hero: { ...draft.hero, cta: value } })} />
                <TextField label="About heading" value={draft.about.heading ?? ""} onChange={(value) => update({ ...draft, about: { ...draft.about, heading: value } })} />
                <TextField
                  label="About biography"
                  multiline
                  value={(draft.about.bio || []).join("\n\n")}
                  onChange={(value) => update({ ...draft, about: { ...draft.about, bio: value.split(/\n\s*\n/).filter(Boolean) } })}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField label="Education (Foundation)" value={draft.about.education ?? ""} onChange={(value) => update({ ...draft, about: { ...draft.about, education: value } })} />
                  <TextField label="School" value={draft.about.school ?? ""} onChange={(value) => update({ ...draft, about: { ...draft.about, school: value } })} />
                </div>
                <TextField label="Experience start year" value={String(draft.about.experienceStartYear ?? "")} onChange={(value) => update({ ...draft, about: { ...draft.about, experienceStartYear: Number(value) || 0 } })} />
                <TextField label="Services description" multiline value={draft.services.description ?? ""} onChange={(value) => update({ ...draft, services: { ...draft.services, description: value } })} />
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
                    setActiveProjectTab("General");
                  }}
                  className="button-focus inline-flex items-center gap-2 rounded-[8px] bg-ink px-4 py-3 text-xs uppercase tracking-[0.18em] text-bone"
                >
                  <Plus size={15} /> Add Project
                </button>
              </div>
              <p className="mb-3 text-sm text-ink/58">Drag projects to reorder the public showcase and archive.</p>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                {draft.projects.map((item, index) => (
                  <button
                    key={item.slug}
                    draggable
                    onDragStart={(event) => {
                      setDraggedProjectIndex(index);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(index));
                    }}
                    onDragEnd={() => setDraggedProjectIndex(null)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const from = draggedProjectIndex ?? Number(event.dataTransfer.getData("text/plain"));
                      moveProject(from, index);
                      setDraggedProjectIndex(null);
                    }}
                    onClick={() => {
                      setActiveProject(index);
                      setActiveProjectTab("General");
                    }}
                    className={`button-focus shrink-0 cursor-grab rounded-[8px] border px-4 py-2 text-sm active:cursor-grabbing ${
                      activeProject === index ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white"
                    } ${draggedProjectIndex === index ? "opacity-45 ring-2 ring-bronze/40" : ""}`}
                  >
                    <span className="mr-2 text-xs text-current/50">{index + 1}</span>
                    {item.title || `Project ${index + 1}`}
                  </button>
                ))}
              </div>

              {project ? (
                <div className="grid gap-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      "General",
                      "Hero",
                      "Gallery",
                      "Before / Plans / Drawings",
                      "SEO"
                    ].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveProjectTab(tab)}
                        className={`button-focus rounded-[999px] border px-4 py-2 text-xs uppercase tracking-[0.18em] ${activeProjectTab === tab ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white text-ink/80"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-5">
                    {activeProjectTab === "General" && (
                      <div className="grid gap-4 rounded-[8px] border border-ink/10 bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-2">
                          <TextField label="Title" value={project.title ?? ""} onChange={(value) => updateProjectField({ title: value })} />
                          <TextField label="Subtitle" value={project.subtitle ?? ""} onChange={(value) => updateProjectField({ subtitle: value })} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <TextField label="Category" value={project.category ?? ""} onChange={(value) => updateProjectField({ category: value })} />
                          <TextField label="Location" value={project.location ?? ""} onChange={(value) => updateProjectField({ location: value })} />
                          <TextField label="Completion date" value={project.completionDate ?? ""} onChange={(value) => updateProjectField({ completionDate: value })} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <TextField label="Year" value={project.year ?? ""} onChange={(value) => updateProjectField({ year: value })} />
                          <TextField label="Duration" value={project.duration ?? ""} onChange={(value) => updateProjectField({ duration: value })} />
                          <TextField label="Area" value={project.area ?? ""} onChange={(value) => updateProjectField({ area: value })} />
                        </div>
                        <TextField label="Focus" value={project.focus ?? ""} onChange={(value) => updateProjectField({ focus: value })} />
                        <TextField label="Summary" multiline value={project.summary ?? ""} onChange={(value) => updateProjectField({ summary: value })} />
                        <TextField label="Overview" multiline value={project.overview ?? ""} onChange={(value) => updateProjectField({ overview: value })} />
                        <TextField
                          label="Materials (comma separated)"
                          value={(project.materials || []).join(", ")}
                          onChange={(value) => updateProjectField({ materials: value.split(",").map((item) => item.trim()).filter(Boolean) })}
                        />
                        <div className="grid gap-3 rounded-[8px] border border-ink/10 bg-bone p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-ink/60">Project Details</p>
                          {(project.details || []).map((detail, index) => (
                            <div key={index} className="grid gap-3 rounded-[8px] border border-ink/10 bg-white p-4">
                              <TextField
                                label="Detail title"
                                value={detail.title ?? ""}
                                onChange={(value) => {
                                  const details = [...(project.details || [])];
                                  details[index] = { ...details[index], title: value };
                                  setProjectArray("details", details as Project["details"]);
                                }}
                              />
                              <TextField
                                label="Detail body"
                                multiline
                                value={detail.body ?? ""}
                                onChange={(value) => {
                                  const details = [...(project.details || [])];
                                  details[index] = { ...details[index], body: value };
                                  setProjectArray("details", details as Project["details"]);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const details = (project.details || []).filter((_, itemIndex) => itemIndex !== index);
                                  setProjectArray("details", details as Project["details"]);
                                }}
                                className="button-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-clay/30 px-4 py-3 text-xs uppercase tracking-[0.18em] text-clay"
                              >
                                <Trash2 size={15} /> Remove detail
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setProjectArray("details", [
                              ...(project.details || []),
                              { title: "New detail", body: "More project detail." }
                            ] as Project["details"])}
                            className="button-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-ink/10 bg-white px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink"
                          >
                            <Plus size={15} /> Add detail
                          </button>
                        </div>
                      </div>
                    )}

                    {activeProjectTab === "Hero" && (
                      <section className="grid gap-5 rounded-[8px] border border-ink/10 bg-white p-5">
                        <SectionLabel>Project Hero</SectionLabel>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-[8px] border border-ink/10 bg-[#f6efe6] p-4">
                            <div className="relative h-72 overflow-hidden rounded-[8px] bg-[#e9dfd1]">
                              <img src={project.heroImage ?? "/media/extra/1.png"} alt={project.title ?? "Hero image"} className="h-full w-full object-cover" />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => heroImageInputRef.current?.click()}
                                className="button-focus inline-flex items-center gap-2 rounded-[8px] border border-bronze bg-bronze/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-bronze transition hover:bg-bronze hover:text-bone disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isUploading ? <UploadSpinner /> : <ImagePlus size={16} />}
                                <span>{isUploading ? "Uploading..." : "+ Upload Hero Image"}</span>
                              </button>
                              <input
                                ref={heroImageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploading}
                                onChange={async (event) => {
                                  const file = event.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const [src] = await uploadImages([file]);
                                    updateProjectField({ heroImage: src });
                                  } catch (error) {
                                    setUploadMessage(error instanceof Error ? error.message : "Image upload failed");
                                  } finally {
                                    event.target.value = "";
                                  }
                                }}
                              />
                              <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => updateProjectField({ heroImage: "" })}
                                className="button-focus rounded-[8px] border border-clay/30 bg-white px-4 py-3 text-xs uppercase tracking-[0.18em] text-clay disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Remove hero
                              </button>
                            </div>
                          </div>
                          <div className="grid gap-4">
                            <TextField label="Hero image caption" value={project.gallery?.[0]?.caption ?? ""} onChange={(value) => {
                              const gallery = [...(project.gallery || [])];
                              if (gallery.length === 0) gallery.push(createImageAsset(project.heroImage ?? "", project.title ?? "", ""));
                              gallery[0] = { ...gallery[0], caption: value };
                              setProjectArray("gallery", gallery);
                            }} />
                            <TextField label="Hero image description" multiline value={project.gallery?.[0]?.description ?? ""} onChange={(value) => {
                              const gallery = [...(project.gallery || [])];
                              if (gallery.length === 0) gallery.push(createImageAsset(project.heroImage ?? "", project.title ?? "", ""));
                              gallery[0] = { ...gallery[0], description: value };
                              setProjectArray("gallery", gallery);
                            }} />
                          </div>
                        </div>
                      </section>
                    )}

                    {activeProjectTab === "Gallery" && renderImageManager("Image Gallery", project.gallery || [], (next) => setProjectArray("gallery", next))}

                    {activeProjectTab === "Before / Plans / Drawings" && (
                      <div className="grid gap-5">
                        {[
                          { key: "before", label: "Before Images" },
                          { key: "floorPlans", label: "Floor Plans" },
                          { key: "technicalDrawings", label: "Technical Drawings" },
                          { key: "renders", label: "3D Renders" },
                          { key: "concepts", label: "Design Concepts" }
                        ].map((group) => (
                          <div key={group.key}>
                            {renderImageManager(
                              group.label,
                              project.technical?.[group.key as keyof typeof project.technical] || [],
                              (next) =>
                                setProjectArray("technical", {
                                  ...project.technical,
                                  [group.key]: next
                                } as Project["technical"])
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {activeProjectTab === "SEO" && (
                      <section className="grid gap-4 rounded-[8px] border border-ink/10 bg-white p-5">
                        <SectionLabel>SEO</SectionLabel>
                        <TextField label="Page title" value={project.seo?.title ?? ""} onChange={(value) => setProjectArray("seo", { ...project.seo, title: value } as Project["seo"])} />
                        <TextField label="Meta description" multiline value={project.seo?.description ?? ""} onChange={(value) => setProjectArray("seo", { ...project.seo, description: value } as Project["seo"])} />
                        <TextField label="Keywords" value={project.seo?.keywords ?? ""} onChange={(value) => setProjectArray("seo", { ...project.seo, keywords: value } as Project["seo"])} />
                      </section>
                    )}

                    <section className="rounded-[8px] border border-ink/10 bg-[#fdf8f2] p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <SectionLabel>Live preview</SectionLabel>
                          <p className="text-sm text-ink/60">See the current project state update as you edit.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ink/70">Live</span>
                      </div>
                      <div className="mt-5 grid gap-4 rounded-[8px] border border-ink/10 bg-white p-4">
                        <div className="relative h-64 overflow-hidden rounded-[8px] bg-[#f5efe4]">
                          <img src={project.heroImage ?? "/media/extra/1.png"} alt={project.title ?? "Hero"} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-bronze">{project.category || "Project"} {project.location ? `/ ${project.location}` : ""}</p>
                          <h2 className="mt-4 font-display text-3xl">{project.title}</h2>
                          {project.subtitle ? <p className="mt-3 text-ink/70">{project.subtitle}</p> : null}
                          {project.summary ? <p className="mt-4 leading-7 text-ink/65">{project.summary}</p> : null}
                        </div>
                      </div>
                    </section>

                    <button
                      type="button"
                      onClick={() => {
                        const projects = [...draft.projects];
                        projects.splice(activeProject, 1);
                        update({ ...draft, projects });
                        setActiveProject(Math.max(0, activeProject - 1));
                      }}
                      className="button-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-clay/30 px-4 py-3 text-xs uppercase tracking-[0.18em] text-clay"
                    >
                      <Trash2 size={15} /> Delete project
                    </button>
                  </div>
                </div>
              ) : null}
            </section>

            <div className="grid gap-5 md:grid-cols-3 items-start">
              <section className="rounded-[8px] border border-ink/10 bg-white p-5">
                <SectionLabel>Services</SectionLabel>
                <p className="mb-4 text-sm text-ink/60">Add, edit, delete, and reorder service offerings.</p>
                <div className="grid gap-4">
                  {draft.services.items.map((service, index) => (
                    <div key={index} className="rounded-[8px] border border-ink/10 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink">Service {index + 1}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => update({ ...draft, services: { ...draft.services, items: reorderArray(draft.services.items, index, index - 1) } })}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={index === draft.services.items.length - 1}
                          onClick={() => update({ ...draft, services: { ...draft.services, items: reorderArray(draft.services.items, index, index + 1) } })}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => update({ ...draft, services: { ...draft.services, items: draft.services.items.filter((_, itemIndex) => itemIndex !== index) } })}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-clay/30 bg-white text-clay"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <TextField label="Title" value={service.title ?? ""} onChange={(value) => updateService(index, { ...service, title: value })} />
                      <TextField label="Description" multiline value={service.description ?? ""} onChange={(value) => updateService(index, { ...service, description: value })} />
                      <TextField label="Icon" value={service.icon ?? ""} onChange={(value) => updateService(index, { ...service, icon: value })} />
                      <label className="inline-flex items-center gap-3 text-sm text-ink/70">
                        <input
                          type="checkbox"
                          checked={Boolean(service.featured)}
                          onChange={(event) => updateService(index, { ...service, featured: event.target.checked })}
                        />
                        Featured
                      </label>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update({ ...draft, services: { ...draft.services, items: [...draft.services.items, makeService()] } })}
                  className="button-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-ink/10 bg-bone px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink"
                >
                  <Plus size={15} /> Add service
                </button>
              </div>
            </section>

            <section className="rounded-[8px] border border-ink/10 bg-white p-5">
              <SectionLabel>Testimonials</SectionLabel>
              <p className="mb-4 text-sm text-ink/60">Client feedback can be managed here.</p>
              <div className="grid gap-4">
                {draft.testimonials.map((testimonial, index) => (
                  <div key={index} className="rounded-[8px] border border-ink/10 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink">Testimonial {index + 1}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => update({ ...draft, testimonials: reorderArray(draft.testimonials, index, index - 1) })}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={index === draft.testimonials.length - 1}
                          onClick={() => update({ ...draft, testimonials: reorderArray(draft.testimonials, index, index + 1) })}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => update({ ...draft, testimonials: draft.testimonials.filter((_, itemIndex) => itemIndex !== index) })}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-clay/30 bg-white text-clay"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <TextField label="Client name" value={testimonial.author ?? ""} onChange={(value) => updateTestimonial(index, { ...testimonial, author: value })} />
                      <TextField label="Designation" value={testimonial.role ?? ""} onChange={(value) => updateTestimonial(index, { ...testimonial, role: value })} />
                      <TextField label="Company" value={testimonial.company ?? ""} onChange={(value) => updateTestimonial(index, { ...testimonial, company: value })} />
                      <TextField label="Quote" multiline value={testimonial.quote ?? ""} onChange={(value) => updateTestimonial(index, { ...testimonial, quote: value })} />
                      <TextField label="Client image URL" value={testimonial.image ?? ""} onChange={(value) => updateTestimonial(index, { ...testimonial, image: value })} />
                      <TextField label="Rating (1-5)" value={String(testimonial.rating ?? "")} onChange={(value) => updateTestimonial(index, { ...testimonial, rating: Number(value) || 0 })} />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update({ ...draft, testimonials: [...draft.testimonials, makeTestimonial()] })}
                  className="button-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-ink/10 bg-bone px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink"
                >
                  <Plus size={15} /> Add testimonial
                </button>
              </div>
            </section>

            <section className="rounded-[8px] border border-ink/10 bg-white p-5">
              <SectionLabel>Process</SectionLabel>
              <p className="mb-4 text-sm text-ink/60">Add process steps and reorder them to match your workflow.</p>
              <div className="grid gap-4">
                {draft.process.map((step, index) => (
                  <div key={index} className="rounded-[8px] border border-ink/10 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink">Step {step.stepNumber || String(index + 1).padStart(2, "0")}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            const next = reorderArray(draft.process, index, index - 1).map((item, position) => ({ ...item, stepNumber: String(position + 1).padStart(2, "0") }));
                            update({ ...draft, process: next });
                          }}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={index === draft.process.length - 1}
                          onClick={() => {
                            const next = reorderArray(draft.process, index, index + 1).map((item, position) => ({ ...item, stepNumber: String(position + 1).padStart(2, "0") }));
                            update({ ...draft, process: next });
                          }}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ink/10 bg-bone text-ink/70 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => update({ ...draft, process: draft.process.filter((_, itemIndex) => itemIndex !== index).map((item, position) => ({ ...item, stepNumber: String(position + 1).padStart(2, "0") })) })}
                          className="button-focus inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-clay/30 bg-white text-clay"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <TextField label="Title" value={step.title ?? ""} onChange={(value) => updateProcess(index, { ...step, title: value })} />
                      <TextField label="Description" multiline value={step.description ?? ""} onChange={(value) => updateProcess(index, { ...step, description: value })} />
                      <TextField label="Icon / Image" value={step.icon ?? ""} onChange={(value) => updateProcess(index, { ...step, icon: value })} />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update({ ...draft, process: [...draft.process, makeProcessStep(draft.process.length)] })}
                  className="button-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-ink/10 bg-bone px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink"
                >
                  <Plus size={15} /> Add step
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
