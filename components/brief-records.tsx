"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Brief, briefText, emptyBrief, newBrief, saveBrief } from "@/lib/state";
import { mutate } from "@/lib/browser-store";
import { projects } from "@/lib/content";
import { useDemo } from "./store";
import { Icon } from "./icons";
export function DownloadBrief({ brief }: { brief: Brief }) {
  function download() {
    const blob = new Blob([briefText(brief)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.reference.toLowerCase()}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="download-actions">
      <button className="button button-outline" onClick={download}>
        <Icon name="download" />
        Download text summary
      </button>
      <button className="button button-outline" onClick={() => window.print()}>
        Print brief
      </button>
    </div>
  );
}
export function BriefOverview({ brief }: { brief: Brief }) {
  const d = brief.data;
  return (
    <>
      <p className="mono">{brief.reference}</p>
      <h2>{d.type || "Untitled"} project brief</h2>
      <span className={`status-tag ${brief.status === "New" ? "new" : ""}`}>
        {brief.kind === "draft" ? "Draft" : brief.status}
      </span>
      <p className="detail-summary">
        {d.summary || "Your project description has not been added yet."}
      </p>
      <dl className="review-summary">
        {[
          ["Contact", `${d.name || "Not added"}\n${d.email || "Not added"}`],
          [
            "Context",
            `${d.location || "Not decided"}\n${d.intervention || "Not decided"}${d.area ? ` · ${d.area} m² (self-reported)` : ""}`,
          ],
          ["Priorities", d.priorities.join(", ") || "Not selected"],
          [
            "Timing / budget",
            `${d.timeframe || "Not decided"}\n${d.budget || "Not decided"} (${d.currency || "USD"}) — self-reported`,
          ],
          [
            "References",
            d.references
              .map((id) => projects.find((p) => p.id === id)?.name)
              .filter(Boolean)
              .join(", ") || "None",
          ],
          ["Other links", d.urls || "None"],
          ["Updated", new Date(brief.updatedAt).toLocaleString("en-GB")],
        ].map(([name, value]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="local-message">
        Saved locally. No email was sent. Budget information is not a
        professional estimate.
      </p>
    </>
  );
}
export function BriefRecords() {
  const s = useDemo();
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  if (!s.hydrated) return <p>Opening your local records…</p>;
  const selected = s.state.briefs.find((b) => b.id === id);
  function create() {
    const b = newBrief({ ...emptyBrief(), references: s.state.saved });
    if (mutate((state) => saveBrief(state, b), "A fresh draft is ready."))
      router.push(`/start-a-project/?draft=${b.id}`);
  }
  function remove(b: Brief) {
    if (
      confirm(`Delete ${b.reference} from this browser? This cannot be undone.`)
    ) {
      if (
        mutate(
          (state) => ({
            ...state,
            briefs: state.briefs.filter((x) => x.id !== b.id),
          }),
          "Brief deleted.",
        )
      )
        router.replace("/my-brief/");
    }
  }
  if (id)
    return selected ? (
      <section className="brief-detail">
        <Link className="text-link no-print" href="/my-brief/">
          Back to all briefs
        </Link>
        <div style={{ marginTop: 30 }}>
          <BriefOverview brief={selected} />
        </div>
        <DownloadBrief brief={selected} />
        <div className="record-actions no-print">
          {selected.kind === "draft" && (
            <Link
              className="text-link"
              href={`/start-a-project/?draft=${selected.id}`}
            >
              Edit draft
            </Link>
          )}
          <button onClick={() => remove(selected)}>Delete brief</button>
        </div>
        <p className="print-only">
          SECTION / OFFICE · Self-initiated portfolio concept · No message was
          sent.
        </p>
      </section>
    ) : (
      <div className="empty-state">
        <h2>This brief isn’t in this browser.</h2>
        <p>
          It may have been deleted, or created in a different browser or site
          origin.
        </p>
        <Link href="/my-brief/" className="button">
          View local briefs
        </Link>
      </div>
    );
  return (
    <>
      <div className="toolbar">
        <p>
          {s.state.briefs.length} local{" "}
          {s.state.briefs.length === 1 ? "record" : "records"}
        </p>
        <button onClick={create} className="button">
          Start a new brief <Icon name="plus" />
        </button>
      </div>
      {!s.state.briefs.length ? (
        <div className="empty-state">
          <h2>Room for an idea.</h2>
          <p>
            Your drafts and submitted demo briefs will live here. Start with
            sample details to explore the process.
          </p>
          <button onClick={create} className="button">
            Build a brief <Icon name="arrow" />
          </button>
        </div>
      ) : (
        ["draft", "submitted"].map((kind) => {
          const list = s.state.briefs.filter((b) => b.kind === kind);
          return list.length ? (
            <section key={kind}>
              <h2 className="records-heading">
                {kind === "draft" ? "In progress" : "Saved demo briefs"}
              </h2>
              <div className="records">
                {list.map((b) => (
                  <article className="record-row" key={b.id}>
                    <span className="mono">{b.reference}</span>
                    <div>
                      <h2>{b.data.type || "Untitled"} project</h2>
                      <p>
                        {b.data.location || "Context to explore"} ·{" "}
                        {new Date(b.updatedAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <span
                      className={`status-tag ${b.status === "New" ? "new" : ""}`}
                    >
                      {b.kind === "draft" ? "Draft" : b.status}
                    </span>
                    <div className="record-actions">
                      {b.kind === "draft" && (
                        <Link href={`/start-a-project/?draft=${b.id}`}>
                          Edit
                        </Link>
                      )}
                      <Link
                        className="text-link"
                        href={`/my-brief/?id=${b.id}`}
                      >
                        Review <Icon name="arrow" />
                      </Link>
                      <button
                        onClick={() => remove(b)}
                        aria-label={`Delete ${b.reference}`}
                      >
                        <Icon name="close" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null;
        })
      )}
      <p className="local-message">
        Records are available only in this browser profile and site origin.
        Inbox status changes appear here.
      </p>
    </>
  );
}
