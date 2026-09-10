import Link from "next/link";
import { Icon, SectionMark } from "./icons";
import { Photo } from "./photo";
import { Project, projectHref, projects } from "@/lib/content";
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={`text-link ${className}`} href={href}>
      {children}
      <Icon name="diagonal" />
    </Link>
  );
}
export function ProjectCaption({ project }: { project: Project }) {
  return (
    <div className="project-caption">
      <span className="mono project-no">{project.number} /</span>
      <Link href={projectHref(project)} className="caption-title">
        {project.name}
      </Link>
      <span className="caption-category">
        {project.category} · {project.year}
      </span>
      <Link
        href={projectHref(project)}
        className="icon-button"
        aria-label={`Explore ${project.name}`}
      >
        <Icon name="diagonal" />
      </Link>
    </div>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Link
        className="image-link"
        href={projectHref(project)}
        aria-label={`Explore ${project.name}`}
      >
        <Photo
          image={project.images[0]}
          sizes="(max-width:700px) 100vw, 50vw"
        />
      </Link>
      <ProjectCaption project={project} />
    </article>
  );
}
export function Invitation() {
  return (
    <section className="invitation">
      <div>
        <p className="small">A place begins with a conversation.</p>
        <h2>
          What do you
          <br />
          have in mind?
        </h2>
      </div>
      <div className="invitation-end">
        <Link
          href="/start-a-project/"
          className="invitation-arrow"
          aria-label="Start a project"
        >
          <Icon name="diagonal" width="70" height="70" />
        </Link>
        <TextLink href="/start-a-project/">Let’s shape your brief</TextLink>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <Link href="/" className="footer-wordmark">
          SECTION <span>/</span> OFFICE
        </Link>
        <p>
          Architecture · Interiors
          <br />· Spatial Research
        </p>
        <nav aria-label="Footer navigation">
          <Link href="/contact/">Contact</Link>
          <Link href="/saved/">Saved projects</Link>
          <Link href="/my-brief/">My brief</Link>
        </nav>
        <SectionMark />
      </div>
      <div className="footer-bottom">
        <p>
          A self-initiated portfolio concept. Projects and imagery are
          conceptual.
        </p>
        <div>
          <Link href="/demo/">About this demo</Link>
          <Link href="/privacy/">Privacy</Link>
          <span>© SECTION OFFICE 2026</span>
        </div>
      </div>
    </footer>
  );
}
export function Related({ ids }: { ids: string[] }) {
  return (
    <section className="related-section">
      <div className="section-top">
        <h2>In conversation</h2>
        <span className="small">Related studies</span>
      </div>
      <div className="two-grid">
        {ids.map((id) => {
          const p = projects.find((p) => p.id === id);
          return p ? <ProjectCard key={id} project={p} /> : null;
        })}
      </div>
    </section>
  );
}
export function PageIntro({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-intro">
      <h1>{title}</h1>
      <div>
        <p>{description}</p>
        {children}
      </div>
    </div>
  );
}
