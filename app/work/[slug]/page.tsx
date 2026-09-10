import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, projectHref } from "@/lib/content";
import { pageMetadata, siteOrigin } from "@/lib/metadata";
import { Gallery } from "@/components/gallery";
import { ProjectActions } from "@/components/project-actions";
import { Diagram } from "@/components/diagram";
import { TextLink, Related, Invitation } from "@/components/editorial";
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  return p ? pageMetadata(p.name, p.intro, projectHref(p), p.slug) : {};
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <div className="wrap project-page">
      <div className="project-breadcrumb">
        <Link href="/work/">All work</Link>
        <span className="mono">{p.number} / 08</span>
        <span>Concept study</span>
      </div>
      <div className="project-title">
        <h1>{p.name}</h1>
        <p>{p.statement}</p>
      </div>
      <div className="project-facts">
        <div>
          <span>Typology</span>
          <p>{p.category}</p>
        </div>
        <div>
          <span>Site context</span>
          <p>{p.context}</p>
        </div>
        <div>
          <span>Concept year</span>
          <p>{p.year}</p>
        </div>
        <div>
          <span>Indicative area</span>
          <p>{p.area}</p>
        </div>
      </div>
      <p className="fact-note">
        Site and area form part of a fictional design brief.
      </p>
      <Gallery images={p.images} end={1} name={p.name} />
      <div className="project-intro-text">
        <h2>{p.intro}</h2>
        <ProjectActions
          id={p.id}
          name={p.name}
          url={new URL(projectHref(p), siteOrigin).href}
        />
      </div>
      <section className="narrative">
        <h2>The starting point</h2>
        <p>{p.brief}</p>
        <h2>A spatial response</h2>
        <p>{p.response}</p>
      </section>
      {p.flagship && <Diagram slug={p.slug} />}
      <Gallery images={p.images} start={1} name={p.name} />
      <section className="narrative">
        <h2>Moving through</h2>
        <p>{p.experience}</p>
        <h2>Material relationships</h2>
        <div>
          <p>{p.detail}</p>
          <ul className="materials-list">
            {p.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </section>
      <div className="next-project">
        <span className="small">Next study / {next.number}</span>
        <TextLink href={projectHref(next)}>{next.name}</TextLink>
      </div>
      <Related ids={p.related} />
      <Invitation />
    </div>
  );
}
