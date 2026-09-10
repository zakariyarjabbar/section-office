import { pageMetadata } from "@/lib/metadata";
import { PageIntro, TextLink } from "@/components/editorial";
import { DemoControls } from "@/components/demo-controls";
export const metadata = pageMetadata(
  "About this demo",
  "A fictional architecture portfolio with generated concept studies and honest browser-only interactions.",
  "/demo/",
  "fallback",
);
export default function Demo() {
  return (
    <div className="wrap utility-page">
      <PageIntro
        title="A practice, imagined."
        description="SECTION OFFICE is a self-initiated portfolio concept exploring how architecture can be experienced, understood and shared online."
      />
      <DemoControls />
      <section className="narrative">
        <h2>What you are looking at</h2>
        <p>
          Eight original fictional design studies, three editorial notes and
          generated architectural visualizations. No work is presented as built,
          commissioned or professionally registered. Specifications are part of
          the imagined design briefs.
        </p>
        <h2>What you can try</h2>
        <div>
          <p>
            Explore the projects, save references and build a brief. Drafts
            survive refresh when browser storage is available. Submit a demo
            brief, download its summary and change its status in the studio-side
            demonstration.
          </p>
          <TextLink href="/start-a-project/">Build a project brief</TextLink>
        </div>
        <h2>Where the data lives</h2>
        <p>
          All mutable data belongs to this browser profile and site origin. It
          does not move between devices. The inbox is openly accessible and
          offers no authentication or real message delivery. If storage fails,
          the site offers an explicit temporary session; clearing site data
          removes local records.
        </p>
      </section>
    </div>
  );
}
