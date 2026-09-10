"use client";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/lib/content";
import { mutate } from "@/lib/browser-store";
import { useDemo } from "./store";
import { ProjectCard } from "./editorial";
import { SaveButton } from "./project-actions";
import { Icon } from "./icons";
export function SavedProjects() {
  const s = useDemo();
  const [excluded, setExcluded] = useState<string[]>([]);
  const saved = projects.filter((p) => s.state.saved.includes(p.id));
  const selected = saved.filter((p) => !excluded.includes(p.id));
  if (!s.hydrated) return <p>Opening your saved references…</p>;
  if (!saved.length)
    return (
      <div className="empty-state">
        <h2>A collection starts with one space.</h2>
        <p>
          Save a project as you explore the work. Your references will stay in
          this browser, ready to bring into a brief.
        </p>
        <Link href="/work/" className="button">
          Explore the studies <Icon name="arrow" />
        </Link>
      </div>
    );
  return (
    <>
      <div className="toolbar">
        <p>
          {saved.length} saved {saved.length === 1 ? "study" : "studies"} · this
          browser only
        </p>
        <div>
          <button
            className="reset-button"
            onClick={() => {
              if (
                confirm(
                  "Remove all saved project references? Your briefs will remain.",
                )
              )
                mutate(
                  (state) => ({ ...state, saved: [] }),
                  "Saved references cleared.",
                );
            }}
          >
            Clear collection
          </button>
          <Link
            className="button"
            aria-disabled={!selected.length}
            href={
              selected.length
                ? `/start-a-project/?refs=${selected.map((p) => p.id).join(",")}`
                : "#"
            }
            onClick={(e) => {
              if (!selected.length) e.preventDefault();
            }}
          >
            Use {selected.length} in a brief <Icon name="arrow" />
          </Link>
        </div>
      </div>
      <div className="work-grid">
        {saved.map((p) => (
          <div key={p.id} style={{ position: "relative" }}>
            <ProjectCard project={p} />
            <SaveButton id={p.id} compact />
            <label className="consent" style={{ paddingTop: 12 }}>
              <input
                type="checkbox"
                checked={!excluded.includes(p.id)}
                onChange={() =>
                  setExcluded((e) =>
                    e.includes(p.id)
                      ? e.filter((id) => id !== p.id)
                      : [...e, p.id],
                  )
                }
              />
              Include in my brief
            </label>
          </div>
        ))}
      </div>
      <p className="small muted">
        A link to this page does not share your collection. Individual project
        pages have public share links.
      </p>
    </>
  );
}
