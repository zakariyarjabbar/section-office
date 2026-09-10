import Link from "next/link";
import { projects, articles, projectHref } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Photo } from "@/components/photo";
import { Icon } from "@/components/icons";
import { TextLink, ProjectCaption, Invitation } from "@/components/editorial";
export const metadata = pageMetadata(
  "SECTION OFFICE — Architecture & Interiors",
  "Explore a concept architecture studio through photographic project stories, spatial research, and considered interiors.",
);
export default function Home() {
  const [fold, foundry, common] = projects;
  return (
    <>
      <section className="home-opening wrap">
        <div className="hero-heading">
          <h1>
            Architecture for
            <br />
            everyday <span>life.</span>
          </h1>
          <div className="hero-aside">
            <p>
              Spaces shaped by light,
              <br />
              material, and the way we live.
            </p>
            <span className="mono">INDEPENDENT BY DESIGN</span>
          </div>
        </div>
        <div className="hero-composition">
          <aside className="hero-rail">
            <span className="mono">
              SELECTED WORK
              <br /> 2025 — 2026
            </span>
            <div className="rail-bottom">
              <span className="mono">01 / 08</span>
              <Icon name="arrow" className="down-arrow" />
            </div>
          </aside>
          <div className="hero-photo-wrap">
            <Link
              className="image-link hero-photo-link"
              href={projectHref(fold)}
              aria-label="Explore Fold House"
            >
              <Photo
                image={fold.images[0]}
                priority
                sizes="(max-width:700px) 100vw, 90vw"
              />
              <span className="image-open">
                <Icon name="diagonal" />
              </span>
            </Link>
            <ProjectCaption project={fold} />
          </div>
        </div>
      </section>
      <section className="practice-intro wrap">
        <span className="small section-label">The practice</span>
        <div>
          <h2>
            Good spaces make room
            <br />
            for what matters.
          </h2>
          <div className="practice-bottom">
            <p>
              We explore the relationship between buildings and the life within
              them. From a single room to a shared public place, our work begins
              with attention: to light, to materials, and to people.
            </p>
            <TextLink href="/studio/">Inside the studio</TextLink>
          </div>
        </div>
      </section>
      <section className="selected-secondary wrap">
        <div className="secondary-heading">
          <p className="mono">02 / SELECTED STUDY</p>
          <h2>
            What remains.
            <br />
            What comes next.
          </h2>
          <p>
            A new use for an industrial shell.
            <br />
            Foundry Hall explores the useful past.
          </p>
        </div>
        <article className="secondary-photo">
          <Link className="image-link" href={projectHref(foundry)}>
            <Photo
              image={foundry.images[0]}
              sizes="(max-width:700px) 100vw, 65vw"
            />
          </Link>
          <ProjectCaption project={foundry} />
        </article>
      </section>
      <section className="common-feature">
        <div className="wrap">
          <div className="section-top">
            <h2>A place to gather.</h2>
            <p>Architecture begins at the threshold.</p>
          </div>
          <Link href={projectHref(common)} className="image-link">
            <Photo image={common.images[0]} sizes="100vw" />
          </Link>
          <ProjectCaption project={common} />
        </div>
      </section>
      <section className="materials-section wrap">
        <div className="section-top">
          <h2>Close to the material.</h2>
          <TextLink href="/process/">How we work</TextLink>
        </div>
        <div className="material-strip">
          {[fold, common, foundry].map((p, i) => (
            <figure key={p.id}>
              <Link href={projectHref(p)} className="image-link">
                <Photo
                  image={p.images[4]}
                  sizes="(max-width:700px) 60vw, 30vw"
                />
              </Link>
              <figcaption>
                <span className="mono">0{i + 1}</span>
                <span>
                  {
                    [
                      ["Concrete / Oak", "Fold House"],
                      ["Brick / Birch", "Common Ground"],
                      ["Brick / Steel", "Foundry Hall"],
                    ][i][0]
                  }
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="material-note">
          Texture, weight, the way two things meet.
          <br />
          Details are where a space becomes tangible.
        </p>
      </section>
      <section className="index-section wrap">
        <div className="section-top">
          <h2>Further explorations</h2>
          <TextLink href="/work/">
            All work <span className="mono">[08]</span>
          </TextLink>
        </div>
        <div className="editorial-index">
          {projects.slice(3).map((p) => (
            <Link key={p.id} href={projectHref(p)}>
              <span className="mono">{p.number}</span>
              <h3>{p.name}</h3>
              <span>{p.category}</span>
              <span className="mono">{p.year}</span>
              <Icon name="diagonal" />
            </Link>
          ))}
        </div>
      </section>
      <section className="journal-home wrap">
        <div className="section-top">
          <h2>Notes from the studio</h2>
          <TextLink href="/journal/">The journal</TextLink>
        </div>
        <div className="two-grid">
          {articles.slice(0, 2).map((a) => {
            const p = projects.find((p) => p.id === a.project)!;
            return (
              <article key={a.slug}>
                <Link className="image-link" href={`/journal/${a.slug}/`}>
                  <Photo
                    image={p.images[a.imageIndex]}
                    sizes="(max-width:700px) 100vw, 50vw"
                  />
                </Link>
                <p className="mono article-theme">
                  {a.theme} / {a.minutes} MIN READ
                </p>
                <h3>
                  <TextLink href={`/journal/${a.slug}/`}>{a.title}</TextLink>
                </h3>
                <p>{a.subtitle}</p>
              </article>
            );
          })}
        </div>
      </section>
      <div className="wrap">
        <Invitation />
      </div>
    </>
  );
}
