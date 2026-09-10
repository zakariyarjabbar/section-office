"use client";
import { useState } from "react";
import { useDemo } from "./store";
import { mutate } from "@/lib/browser-store";
import { STATUSES, Status } from "@/lib/state";
import { Field } from "./forms";
import { BriefOverview } from "./brief-records";
import { Icon } from "./icons";
import Link from "next/link";
export function Inbox() {
  const s = useDemo();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  if (!s.hydrated) return <p>Opening local inquiries…</p>;
  const entries = [
    ...s.state.briefs
      .filter((b) => b.kind === "submitted")
      .map((b) => ({
        id: b.id,
        name: b.data.name,
        email: b.data.email,
        title: `${b.data.type} brief`,
        date: b.submittedAt!,
        status: b.status,
        notes: b.notes,
        kind: "brief" as const,
      })),
    ...s.state.inquiries.map((q) => ({
      id: q.id,
      name: q.name,
      email: q.email,
      title: "Contact inquiry",
      date: q.createdAt,
      status: q.status,
      notes: q.notes,
      kind: "inquiry" as const,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = entries.filter((e) =>
    `${e.name} ${e.email} ${e.title} ${e.status}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const current = filtered.find((e) => e.id === selectedId) || filtered[0];
  function change(id: string, field: "status" | "notes", value: string) {
    mutate((state) => ({
      ...state,
      briefs: state.briefs.map((b) =>
        b.id === id
          ? { ...b, [field]: value, updatedAt: new Date().toISOString() }
          : b,
      ),
      inquiries: state.inquiries.map((q) =>
        q.id === id ? { ...q, [field]: value } : q,
      ),
    }));
  }
  function remove() {
    if (!current) return;
    if (
      confirm(
        `Delete this ${current.kind === "brief" ? "brief" : "inquiry"} and its notes from this browser?`,
      )
    )
      mutate(
        (state) => ({
          ...state,
          briefs: state.briefs.filter((b) => b.id !== current.id),
          inquiries: state.inquiries.filter((q) => q.id !== current.id),
        }),
        "Local record deleted.",
      );
  }
  if (!entries.length)
    return (
      <div className="empty-state">
        <h2>No local inquiries yet.</h2>
        <p>
          Submit a demo brief or add sample data to explore a studio-side
          review.
        </p>
        <Link className="button" href="/demo/">
          Add sample data <Icon name="arrow" />
        </Link>
      </div>
    );
  return (
    <>
      <div className="toolbar">
        <div className="search-field">
          <Icon name="search" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inquiries…"
            aria-label="Search inquiries"
          />
        </div>
        <p aria-live="polite">
          {filtered.length} local {filtered.length === 1 ? "record" : "records"}
        </p>
      </div>
      {!filtered.length ? (
        <div className="empty-state">
          <h2>No matching inquiries.</h2>
          <button
            className="button button-outline"
            onClick={() => setQuery("")}
          >
            Reset search
          </button>
        </div>
      ) : (
        <div className="inbox-layout">
          <div className="inbox-items" aria-label="Local inquiries">
            {filtered.map((e) => (
              <button
                className="inbox-item"
                key={e.id}
                aria-pressed={current?.id === e.id}
                onClick={() => {
                  setSelectedId(e.id);
                  if (window.innerWidth < 600)
                    requestAnimationFrame(() =>
                      document
                        .getElementById("inbox-detail")
                        ?.scrollIntoView({ block: "start" }),
                    );
                }}
              >
                <span className="mono">
                  {e.title} / {new Date(e.date).toLocaleDateString("en-GB")}
                </span>
                <h2>{e.name}</h2>
                <p className="small">{e.email}</p>
                <span
                  className={`status-tag ${e.status === "New" ? "new" : ""}`}
                  style={{ marginTop: 12 }}
                >
                  {e.status}
                </span>
              </button>
            ))}
          </div>
          {current && (
            <section
              className="inbox-detail"
              id="inbox-detail"
              aria-label="Selected inquiry"
            >
              {current.kind === "brief" ? (
                <BriefOverview
                  brief={s.state.briefs.find((b) => b.id === current.id)!}
                />
              ) : (
                <>
                  <h2>{current.name}</h2>
                  <p className="small muted">{current.email}</p>
                  <p style={{ margin: "25px 0", lineHeight: 1.75 }}>
                    {
                      s.state.inquiries.find((q) => q.id === current.id)
                        ?.message
                    }
                  </p>
                </>
              )}
              <Field label="Local review status" name="inbox-status">
                <select
                  id="inbox-status"
                  value={current.status}
                  onChange={(e) =>
                    change(current.id, "status", e.target.value as Status)
                  }
                >
                  {STATUSES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="Local studio notes"
                name="inbox-notes"
                hint="Notes remain in this browser and are not sent to anyone."
              >
                <textarea
                  id="inbox-notes"
                  value={current.notes}
                  onChange={(e) => change(current.id, "notes", e.target.value)}
                  maxLength={4000}
                />
              </Field>
              <p className="inbox-note">
                Changes save immediately when browser storage is available. A
                brief’s status also appears in My brief.
              </p>
              <button
                className="reset-button"
                onClick={remove}
                style={{ marginTop: 20 }}
              >
                Delete local record
              </button>
            </section>
          )}
        </div>
      )}
    </>
  );
}
