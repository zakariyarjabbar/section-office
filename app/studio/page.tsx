import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/content";
import { PageIntro, Invitation, TextLink } from "@/components/editorial";
import { Photo } from "@/components/photo";
export const metadata = pageMetadata(
  "Studio",
  "An independent concept practice exploring spatial clarity, material relationships and human use.",
  "/studio/",
  "fallback",
);
export default function Studio() {
  return (
    <div className="wrap">
      <PageIntro
        title="An attentive practice."
        description="Architecture · Interiors · Spatial Research. Spaces shaped by light, material, and everyday life."
      />
      <div className="studio-hero">
        <Photo image={projects[6].images[0]} priority sizes="100vw" />
      </div>
      <section className="studio-statement">
        <h2>Our point of view</h2>
        <p>
          We believe a space earns its character through the way it is used. A
          patch of light. A useful edge. A room that feels natural to be in.
        </p>
      </section>
      <section className="principles">
        <figure>
          <Photo
            image={projects[0].images[3]}
            sizes="(max-width:600px) 100vw, 40vw"
          />
          <figcaption className="article-credit">
            Fold House · generated concept visualization
          </figcaption>
        </figure>
        <div>
          <div className="principle">
            <h3>Clarity before complexity</h3>
            <p>
              We look for the simple spatial idea that can hold a project
              together. It might be a courtyard, a shared table or a clear route
              through an existing building. That idea becomes a reference for
              the decisions that follow.
            </p>
          </div>
          <div className="principle">
            <h3>Materials in conversation</h3>
            <p>
              A material is never experienced alone. We study how grain meets
              stone, how a frame holds glass, and how a surface changes in
              daylight. Character comes from these relationships, not from a
              long list of finishes.
            </p>
          </div>
          <div className="principle">
            <h3>Room for everyday life</h3>
            <p>
              We begin with ordinary things: coming home, finding a quiet place,
              making room for others. Architecture should support these moments
              with care and leave space for a life that cannot be fully planned.
            </p>
          </div>
        </div>
      </section>
      <section className="capabilities">
        <h2>Fields of interest</h2>
        <ul>
          <li>Homes & living spaces</li>
          <li>Interiors & joinery</li>
          <li>Cultural & shared spaces</li>
          <li>Adaptive reuse</li>
          <li>Small workplaces</li>
          <li>Spatial research</li>
        </ul>
      </section>
      <section className="narrative">
        <h2>About the identity</h2>
        <div>
          <p>
            SECTION OFFICE is a self-initiated portfolio concept: an imagined
            independent practice used to explore architectural storytelling and
            thoughtful digital experiences. The eight studies are original
            fictional briefs, shown through generated visualizations and
            conceptual diagrams.
          </p>
          <TextLink href="/demo/">Explore the demonstration</TextLink>
        </div>
      </section>
      <Invitation />
    </div>
  );
}
