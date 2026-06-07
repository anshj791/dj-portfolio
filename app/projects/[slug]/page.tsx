import { ProjectDetailPage } from "@/components/project-detail-page";
import { portfolioData } from "@/data/portfolio";

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({ slug: project.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ProjectDetailPage slug={params.slug} />;
}
