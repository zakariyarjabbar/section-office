import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/editorial";
import { SavedProjects } from "@/components/saved-projects";
export const metadata = pageMetadata(
  "Saved references",
  "A browser-local collection of concept project references to inform your own brief.",
  "/saved/",
  "fallback",
);
export default function Saved() {
  return (
    <div className="wrap utility-page">
      <PageIntro
        title="Your points of reference."
        description="Spaces, materials and ideas to return to. A collection for this browser, ready to become part of a project brief."
      />
      <SavedProjects />
    </div>
  );
}
