import { notFound } from "next/navigation";
import { articles, projects, projectHref } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Photo } from "@/components/photo";
import { TextLink, Invitation } from "@/components/editorial";
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return a
    ? pageMetadata(
        a.title,
        a.subtitle,
        `/journal/${a.slug}/`,
        a.slug,
        "article",
      )
    : {};
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const p = projects.find((p) => p.id === a.project)!;
  const next = articles[(articles.indexOf(a) + 1) % articles.length];
  return (
    <div className="wrap">
      <header className="article-header">
        <p className="mono article-theme">
          Journal / {a.theme} / {a.minutes} min read
        </p>
        <h1>{a.title}</h1>
        <p>{a.subtitle}</p>
      </header>
      <figure>
        <div className="article-hero">
          <Photo image={p.images[a.imageIndex]} priority sizes="100vw" />
        </div>
        <figcaption className="article-credit">
          {p.name} · {p.images[a.imageIndex].caption} Generated concept
          visualization.
        </figcaption>
      </figure>
      <article className="article-body">
        {a.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((t) => (
              <p key={t.slice(0, 30)}>{t}</p>
            ))}
          </section>
        ))}
        <div className="article-project">
          <p className="small">Explore the study behind this note.</p>
          <TextLink href={projectHref(p)}>{p.name}</TextLink>
        </div>
        <TextLink href={`/journal/${next.slug}/`}>Next: {next.title}</TextLink>
      </article>
      <Invitation />
    </div>
  );
}
