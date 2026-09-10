import { Suspense } from "react";
import { projects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro, Invitation, ProjectCard } from "@/components/editorial";
import { WorkIndex } from "@/components/work-index";
export const metadata = pageMetadata(
  "Work",
  "Eight concept studies in architecture, interiors and spatial research. Explore by typology or material.",
  "/work/",
  "fallback",
);
export default function Work() {
  return (
    <div className="wrap">
      <PageIntro
        title="Work, in section."
        description="Eight studies. Different scales, shared questions. An exploration of how light, material and everyday life shape a place."
      />
      <Suspense
        fallback={
          <div className="work-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        }
      >
        <WorkIndex />
      </Suspense>
      <Invitation />
    </div>
  );
}
