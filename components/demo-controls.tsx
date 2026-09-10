"use client";
import Link from "next/link";
import { useDemo } from "./store";
import { mutate, resetStore } from "@/lib/browser-store";
import { newBrief, sampleBrief, saveBrief } from "@/lib/state";
import { Icon } from "./icons";
export function DemoControls() {
  const s = useDemo();
  const seeded = s.state.briefs.some((b) => b.id === "sample-submitted-brief");
  function seed() {
    if (seeded) return;
    const d = {
      ...newBrief({ ...sampleBrief(), consent: true }),
      id: "sample-submitted-brief",
      reference: "SO-SAMPLE01",
    };
    mutate((state) => {
      if (state.briefs.some((b) => b.id === d.id)) return state;
      return {
        ...saveBrief(state, d, true),
        saved: [...new Set([...state.saved, "fold-house", "common-ground"])],
      };
    }, "Sample brief and references added. Existing records were kept.");
  }
  return (
    <div className="demo-grid">
      <section className="demo-block">
        <h2>Try it with sample details.</h2>
        <p>
          Add a clearly marked example brief and two saved projects. Open the
          brief from the visitor view, then change its status in the local
          studio inbox.
        </p>
        <button
          className="button"
          onClick={seed}
          disabled={!s.hydrated || seeded}
        >
          {seeded ? "Sample data is ready" : "Add sample data"}{" "}
          <Icon name={seeded ? "check" : "plus"} />
        </button>
        <Link className="button button-outline" href="/my-brief/">
          View my briefs
        </Link>
        <Link className="text-link" href="/demo/inbox/">
          Open local studio inbox <Icon name="diagonal" />
        </Link>
      </section>
      <section className="demo-block">
        <h2>A clean starting point.</h2>
        <p>
          Reset saved projects, view preference, drafts, demo submissions,
          inquiries and notes for this site in this browser. Other sites’ data
          is left alone.
        </p>
        <button
          className="button danger"
          disabled={!s.hydrated}
          onClick={() => {
            if (
              confirm(
                "Reset all SECTION OFFICE local data? This deletes this demo’s saved projects, briefs, inquiries and notes in this browser. Other sites are not affected.",
              )
            )
              resetStore();
          }}
        >
          Reset this demo
        </button>
        <p className="small">
          Current mode:{" "}
          {s.mode === "persistent" ? "browser storage" : "temporary session"}.
          Reset is permanent for these local records.
        </p>
      </section>
    </div>
  );
}
