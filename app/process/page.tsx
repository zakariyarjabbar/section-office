import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/content";
import { PageIntro, Invitation } from "@/components/editorial";
import { Photo } from "@/components/photo";
export const metadata = pageMetadata(
  "Process",
  "From a first conversation to a coherent spatial proposal: how questions, drawings and material decisions shape a project.",
  "/process/",
  "fallback",
);
const steps = [
  [
    "Discovery",
    "Understand what a place needs to do.",
    "We begin with the way you live or work, the qualities of the site, and the practical limits around the project. We listen for the things that matter most and the things that are still uncertain.",
    "Your routines, ambitions, broad site context and available information.",
    "A shared brief, priorities and the questions to investigate.",
  ],
  [
    "Concept",
    "Find a clear spatial idea.",
    "We explore the arrangement of spaces, their relationship to light, and the experience of moving between them. Sketches, simple models and material references make different possibilities understandable.",
    "A conversation about alternatives and the trade-offs each one brings.",
    "A coherent direction, explained through plans, views and references.",
  ],
  [
    "Development",
    "Make the relationships precise.",
    "The selected idea becomes a connected set of decisions. Openings, structure, materials and joinery are considered together. In a real commission, specialist input and site information would guide this work.",
    "Timely feedback and agreement on the decisions that shape the next stage.",
    "A more resolved proposal with key dimensions and material relationships.",
  ],
  [
    "Delivery",
    "Communicate the intent clearly.",
    "Drawings and specifications need to tell one consistent story. A real project would define the required approvals, consultant responsibilities and delivery scope before this stage. This demonstration ends with concept studies.",
    "An agreed scope, responsibilities and a realistic sequence of decisions.",
    "Clear documentation appropriate to the agreed stage and project.",
  ],
];
export default function Process() {
  return (
    <div className="wrap">
      <PageIntro
        title="From questions to space."
        description="A considered process makes room for discovery and gives decisions a clear sequence."
      />
      <div className="process-lead">
        <Photo
          image={projects[5].images[2]}
          priority
          sizes="(max-width:600px) 100vw, 60vw"
        />
        <p>
          Understand the whole.
          <br />
          Work through the detail.
          <br />
          Keep the original intention in view.
        </p>
      </div>
      {steps.map(([name, sub, body, need, output], i) => (
        <section className="process-step" key={name}>
          <span className="mono">0{i + 1} /</span>
          <h2>{name}</h2>
          <div>
            <h3
              className="small"
              style={{ letterSpacing: 0, marginBottom: 18 }}
            >
              {sub}
            </h3>
            <p>{body}</p>
            <dl>
              <div>
                <dt>WHAT WE NEED</dt>
                <dd>{need}</dd>
              </div>
              <div>
                <dt>WHAT YOU CAN EXPECT</dt>
                <dd>{output}</dd>
              </div>
            </dl>
          </div>
        </section>
      ))}
      <Invitation />
    </div>
  );
}
