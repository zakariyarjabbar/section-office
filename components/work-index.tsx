"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { projects, categories, projectHref } from "@/lib/content";
import { parseFilters } from "@/lib/state";
import { mutate } from "@/lib/browser-store";
import { Photo } from "./photo";
import { ProjectCaption } from "./editorial";
import { Icon } from "./icons";
import { SaveButton } from "./project-actions";
import { useDemo } from "./store";
export function WorkIndex() {
  const params = useSearchParams();
  const router = useRouter();
  const { state } = useDemo();
  const { category, query } = parseFilters(
    new URLSearchParams(params.toString()),
    categories,
  );
  const filtered = projects.filter(
    (p) =>
      (!category || p.category === category) &&
      (!query ||
        `${p.name} ${p.category} ${p.materials.join(" ")} ${p.intro}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  function update(cat: string, q = query) {
    const s = new URLSearchParams();
    if (cat) s.set("category", cat);
    if (q) s.set("q", q);
    router.push(`/work/${s.size ? "?" + s : ""}`, { scroll: false });
  }
  return (
    <>
      <div className="work-controls">
        <div className="filter-top">
          <div className="filters" aria-label="Filter by typology">
            {["", ...categories].map((c) => (
              <button
                className="filter-button"
                key={c}
                aria-pressed={category === c}
                onClick={() => update(c)}
              >
                {c || "All work"}
              </button>
            ))}
          </div>
          <div className="view-switch" aria-label="View mode">
            <button
              className="icon-button"
              aria-label="Grid view"
              aria-pressed={state.view === "grid"}
              onClick={() => mutate((s) => ({ ...s, view: "grid" }))}
            >
              <Icon name="grid" />
            </button>
            <button
              className="icon-button"
              aria-label="List view"
              aria-pressed={state.view === "list"}
              onClick={() => mutate((s) => ({ ...s, view: "list" }))}
            >
              <Icon name="list" />
            </button>
          </div>
        </div>
        <div className="filter-bottom">
          <form
            className="search-field"
            onSubmit={(e) => {
              e.preventDefault();
              update(
                category,
                String(new FormData(e.currentTarget).get("q") || "").trim(),
              );
            }}
            role="search"
          >
            <Icon name="search" />
            <input
              aria-label="Search projects and materials"
              name="q"
              key={query}
              defaultValue={query}
              maxLength={100}
              placeholder="Search projects, materials…"
            />
            <button type="submit" aria-label="Search" className="icon-button">
              <Icon name="arrow" />
            </button>
          </form>
          <p className="results-count" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "study" : "studies"}
            {category ? ` / ${category}` : ""}
          </p>
          {(category || query) && (
            <button className="reset-button" onClick={() => update("", "")}>
              Reset filters
            </button>
          )}
        </div>
      </div>
      {!filtered.length ? (
        <div className="empty-state">
          <h2>No studies in this view.</h2>
          <p>
            Try a different material or project name, or return to the complete
            collection.
          </p>
          <button className="button" onClick={() => update("", "")}>
            View all eight studies <Icon name="arrow" />
          </button>
        </div>
      ) : state.view === "grid" ? (
        <div className="work-grid">
          {filtered.map((p) => (
            <article className="project-card" key={p.id}>
              <Link
                className="image-link"
                href={projectHref(p)}
                aria-label={`Explore ${p.name}`}
              >
                <Photo
                  image={p.images[0]}
                  sizes="(max-width:600px) 100vw, 50vw"
                />
              </Link>
              <SaveButton compact id={p.id} />
              <ProjectCaption project={p} />
            </article>
          ))}
        </div>
      ) : (
        <div className="work-list">
          {filtered.map((p) => (
            <article className="work-list-row" key={p.id}>
              <Link
                className="thumb image-link"
                href={projectHref(p)}
                aria-label={`Explore ${p.name}`}
              >
                <Photo image={p.images[0]} sizes="100px" />
              </Link>
              <span className="mono">{p.number}</span>
              <Link href={projectHref(p)}>
                <h2>{p.name}</h2>
              </Link>
              <span className="category">{p.category}</span>
              <span className="mono">{p.year}</span>
              <SaveButton compact id={p.id} />
            </article>
          ))}
        </div>
      )}
    </>
  );
}
