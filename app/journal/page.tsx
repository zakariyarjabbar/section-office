import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { articles, projects } from "@/lib/content";
import { PageIntro, Invitation, TextLink } from "@/components/editorial";
import { Photo } from "@/components/photo";
export const metadata = pageMetadata(
  "Journal",
  "Three original notes on thresholds, daylight and the useful past. Observations from the SECTION OFFICE concept practice.",
  "/journal/",
  "fallback",
);
export default function Journal() {
  return (
    <div className="wrap">
      <PageIntro
        title="Notes, in the margins."
        description="Observations on the things that make a space. A small journal of ideas behind the studies."
      />
      <div className="journal-list">
        {articles.map((a) => (
          <article className="journal-entry" key={a.slug}>
            <Link href={`/journal/${a.slug}/`} className="image-link">
              <Photo
                image={
                  projects.find((p) => p.id === a.project)!.images[a.imageIndex]
                }
                sizes="(max-width:600px) 100vw, 50vw"
              />
            </Link>
            <div>
              <span className="mono article-theme">
                {a.theme} / {a.minutes} MIN READ
              </span>
              <h2>
                <Link href={`/journal/${a.slug}/`}>{a.title}</Link>
              </h2>
              <p>{a.subtitle}</p>
              <TextLink href={`/journal/${a.slug}/`}>Read the note</TextLink>
            </div>
          </article>
        ))}
      </div>
      <Invitation />
    </div>
  );
}
