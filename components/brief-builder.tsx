"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  Brief,
  BriefData,
  emptyBrief,
  newBrief,
  sampleBrief,
  validateBrief,
  saveBrief,
  TYPES,
  PRIORITIES,
  PROJECT_IDS,
} from "@/lib/state";
import { mutate } from "@/lib/browser-store";
import { projects } from "@/lib/content";
import { useDemo } from "./store";
import { Icon } from "./icons";
import { Field, ErrorSummary } from "./forms";
const stepNames = [
  "Project type",
  "Context",
  "Timing & budget",
  "References",
  "Contact & review",
];
const shortNames = ["Type", "Context", "Timing", "References", "Review"];
export function BriefBuilder() {
  const s = useDemo();
  const params = useSearchParams();
  const id = params.get("draft");
  const refs = params.get("refs");
  if (!s.hydrated)
    return <p className="small">Opening your local workspace…</p>;
  const record = id
    ? s.state.briefs.find((b) => b.id === id)
    : s.state.briefs.find((b) => b.kind === "draft");
  if (id && !record)
    return (
      <div className="empty-state">
        <h2>This draft isn’t in this browser.</h2>
        <p>Local records stay with the browser where they were created.</p>
        <Link className="button" href="/start-a-project/">
          Start a brief
        </Link>
      </div>
    );
  if (record?.kind === "submitted")
    return (
      <div className="empty-state">
        <h2>
          {s.mode === "session"
            ? "Demo brief kept for this session."
            : "Demo brief saved in this browser."}
        </h2>
        <p>
          Nothing was emailed. Review the saved version or start another draft
          from My brief.
        </p>
        <Link className="button" href={`/my-brief/?id=${record.id}`}>
          Review saved brief
        </Link>
      </div>
    );
  const selected = refs
    ? refs.split(",").filter((id) => PROJECT_IDS.includes(id))
    : s.state.saved;
  return (
    <BuilderForm
      key={id || "current"}
      initial={
        record && refs
          ? { ...record, data: { ...record.data, references: selected } }
          : record
      }
      selected={selected}
    />
  );
}
function BuilderForm({
  initial,
  selected,
}: {
  initial?: Brief;
  selected: string[];
}) {
  const router = useRouter();
  const s = useDemo();
  const [draft, setDraft] = useState<Brief>(
    () => initial || newBrief({ ...emptyBrief(), references: selected }),
  );
  const [step, setStep] = useState(initial?.step || 0);
  const [reached, setReached] = useState(initial?.step || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitLock = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const d = draft.data;
  function persist(next: Brief, message = "") {
    const ok = mutate((state) => saveBrief(state, next), message);
    setSaved(
      ok
        ? s.mode === "session"
          ? "Kept in this temporary session"
          : "Draft saved in this browser"
        : "These edits have not been saved",
    );
    return ok;
  }
  function update<K extends keyof BriefData>(key: K, value: BriefData[K]) {
    const next = {
      ...draft,
      data: { ...d, [key]: value },
      updatedAt: new Date().toISOString(),
      step,
    };
    setDraft(next);
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
    persist(next);
  }
  function go(n: number) {
    if (n > step) {
      const e = validateBrief(d, step);
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
    }
    setErrors({});
    setStep(n);
    setReached((v) => Math.max(v, n));
    const next = { ...draft, step: n, updatedAt: new Date().toISOString() };
    setDraft(next);
    persist(next);
    requestAnimationFrame(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: "center", behavior: "auto" });
    });
  }
  function sample() {
    const next = {
      ...draft,
      data: {
        ...sampleBrief(),
        references: d.references.length
          ? d.references
          : sampleBrief().references,
      },
      updatedAt: new Date().toISOString(),
    };
    setDraft(next);
    setErrors({});
    persist(next, "Sample details added to this draft.");
  }
  function fresh() {
    const n = newBrief({ ...emptyBrief(), references: s.state.saved });
    if (mutate((state) => saveBrief(state, n), "New draft started."))
      router.replace(`/start-a-project/?draft=${n.id}`);
  }
  function submit() {
    if (submitLock.current) return;
    const e = validateBrief(d);
    if (Object.keys(e).length) {
      setErrors(e);
      for (let n = 0; n < 5; n++)
        if (Object.keys(validateBrief(d, n)).length) {
          setStep(n);
          break;
        }
      return;
    }
    submitLock.current = true;
    const next = { ...draft, updatedAt: new Date().toISOString() };
    const ok = mutate(
      (state) => saveBrief(state, next, true),
      "Demo brief saved. No message was sent.",
    );
    if (ok) {
      setDraft({ ...next, kind: "submitted", submittedAt: next.updatedAt });
      setSubmitted(true);
    } else submitLock.current = false;
  }
  if (submitted)
    return (
      <div className="success-panel">
        <div className="success-mark">
          <Icon name="check" width="32" height="32" />
        </div>
        <p className="mono">{draft.reference}</p>
        <h2>
          {s.mode === "session"
            ? "Demo brief kept for this session."
            : "Demo brief saved in this browser."}
        </h2>
        <p>
          Your brief is ready to review. Nothing was emailed or sent to a
          studio.{" "}
          {s.mode === "session"
            ? "Download a copy now; this temporary record will be lost on refresh."
            : "You can return to it from My brief, download a summary, or see it in the local studio inbox."}
        </p>
        <Link className="button" href={`/my-brief/?id=${draft.id}`}>
          Review your brief <Icon name="arrow" />
        </Link>
        <Link className="button button-outline" href="/demo/inbox/">
          Open demo inbox
        </Link>
      </div>
    );
  return (
    <div className="brief-layout">
      <aside className="brief-sidebar">
        <ol className="steps">
          {stepNames.map((name, i) => (
            <li key={name}>
              <button
                onClick={() => go(i)}
                disabled={i > reached}
                aria-current={step === i ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${name}`}
              >
                <span className="step-number">
                  {i < step ? "✓" : `0${i + 1}`}
                </span>
                <span>{shortNames[i]}</span>
              </button>
            </li>
          ))}
        </ol>
        <p>
          A working brief, not a commitment. You can go back and change your
          answers.
        </p>
      </aside>
      <div className="brief-form">
        <div className="brief-tools">
          <button onClick={sample}>Use sample details</button>
          <button onClick={fresh}>Start a fresh draft</button>
          <Link href="/my-brief/">My saved briefs</Link>
        </div>
        <div className="form-heading">
          <h2 ref={heading} tabIndex={-1}>
            {stepNames[step]}
          </h2>
          <span className="mono">{step + 1} / 5</span>
        </div>
        <ErrorSummary errors={errors} />
        {step === 0 && (
          <>
            <p className="form-helper">
              What kind of space are you thinking about?
            </p>
            <fieldset
              style={{ border: 0, padding: 0, margin: 0 }}
              id="type"
              aria-describedby={errors.type ? "type-error" : undefined}
            >
              <legend className="field-label">Choose a project type</legend>
              <div className="choice-grid">
                {TYPES.map((t) => (
                  <label className="choice" key={t}>
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={d.type === t}
                      onChange={() => update("type", t)}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.type && (
              <p id="type-error" className="field-error">
                {errors.type}
              </p>
            )}
          </>
        )}
        {step === 1 && (
          <>
            <p className="form-helper">
              A broad picture is enough. There is no need to enter a private
              site address.
            </p>
            <Field
              label="Broad project location"
              name="location"
              value={d.location}
              onChange={(e) => update("location", e.target.value)}
              maxLength={200}
              placeholder="Town, region, landscape — or Not decided"
              error={errors.location}
            />
            <div className="form-row">
              <Field
                label="Kind of work"
                name="intervention"
                error={errors.intervention}
              >
                <select
                  id="intervention"
                  value={d.intervention}
                  aria-invalid={!!errors.intervention}
                  aria-describedby={
                    errors.intervention ? "intervention-error" : undefined
                  }
                  onChange={(e) => update("intervention", e.target.value)}
                >
                  <option value="">Choose an option</option>
                  {[
                    "New build",
                    "Renovation",
                    "Adaptive reuse",
                    "Not decided",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="Approximate area, m² (optional)"
                name="area"
                inputMode="decimal"
                value={d.area}
                onChange={(e) => update("area", e.target.value)}
                placeholder="For example, 140"
                error={errors.area}
              />
            </div>
            <fieldset
              id="priorities"
              style={{ border: 0, padding: 0, margin: 0 }}
              aria-describedby={
                errors.priorities ? "priorities-error" : undefined
              }
            >
              <legend className="field-label">
                What matters most? Choose one or more.
              </legend>
              <div className="choice-grid">
                {PRIORITIES.map((p) => (
                  <label className="choice" key={p}>
                    <input
                      type="checkbox"
                      checked={d.priorities.includes(p)}
                      onChange={() =>
                        update(
                          "priorities",
                          d.priorities.includes(p)
                            ? d.priorities.filter((v) => v !== p)
                            : [...d.priorities, p],
                        )
                      }
                    />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.priorities && (
              <p className="field-error" id="priorities-error">
                {errors.priorities}
              </p>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <p className="form-helper">
              These are your own starting points, not a fee calculation or a
              professional estimate. “Not decided” is a useful answer.
            </p>
            <Field label="Desired timeframe (optional)" name="timeframe">
              <select
                id="timeframe"
                value={d.timeframe}
                onChange={(e) => update("timeframe", e.target.value)}
              >
                {[
                  "Not decided",
                  "Exploring possibilities",
                  "Within 6 months",
                  "6–12 months",
                  "More than a year",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <div className="form-row">
              <Field
                label="Self-reported project budget (optional)"
                name="budget"
              >
                <select
                  id="budget"
                  value={d.budget}
                  onChange={(e) => update("budget", e.target.value)}
                >
                  {[
                    "Not decided",
                    "Under 100,000",
                    "100,000–250,000",
                    "250,000–500,000",
                    "500,000–1,000,000",
                    "Over 1,000,000",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Budget currency" name="currency">
                <select
                  id="currency"
                  value={d.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  {["USD", "EUR", "GBP", "AED", "CAD", "AUD", "JPY", "IQD"].map(
                    (t) => (
                      <option key={t}>{t}</option>
                    ),
                  )}
                </select>
              </Field>
            </div>
            <p className="small muted">
              Ranges describe your intentions only. This demo makes no cost,
              feasibility or fee assessment.
            </p>
          </>
        )}
        {step === 3 && (
          <>
            <p className="form-helper">
              Choose studies that describe something you like. Saved references
              are selected for you; you can change them here.
            </p>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="field-label">
                Studio references (optional)
              </legend>
              <div className="ref-choices">
                {projects.map((p) => (
                  <label className="ref-choice" key={p.id}>
                    <input
                      type="checkbox"
                      checked={d.references.includes(p.id)}
                      onChange={() =>
                        update(
                          "references",
                          d.references.includes(p.id)
                            ? d.references.filter((id) => id !== p.id)
                            : [...d.references, p.id],
                        )
                      }
                    />
                    <img
                      src={`/images/${p.slug}-1-640.webp`}
                      alt=""
                      width="65"
                      height="55"
                    />
                    <span>
                      {p.name}
                      <small>{p.category}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Field
              label="Other reference links (optional)"
              name="urls"
              error={errors.urls}
              hint="One complete http:// or https:// link per line. No private documents or sign-in links."
            >
              <textarea
                id="urls"
                value={d.urls}
                onChange={(e) => update("urls", e.target.value)}
                maxLength={2000}
                aria-invalid={!!errors.urls}
                aria-describedby={errors.urls ? "urls-error" : "urls-hint"}
                placeholder="https://…"
              />
            </Field>
          </>
        )}
        {step === 4 && (
          <>
            <p className="form-helper">
              Use your own details or the sample option. This form saves locally
              and sends nothing.
            </p>
            <div className="form-row">
              <Field
                label="Name"
                name="name"
                autoComplete="name"
                value={d.name}
                maxLength={100}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={d.email}
                maxLength={254}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />
            </div>
            <Field
              label="Tell us about the space you have in mind"
              name="summary"
              error={errors.summary}
            >
              <textarea
                id="summary"
                maxLength={4000}
                value={d.summary}
                onChange={(e) => update("summary", e.target.value)}
                aria-invalid={!!errors.summary}
                aria-describedby={errors.summary ? "summary-error" : undefined}
              />
            </Field>
            <h3 style={{ fontSize: 24, marginTop: 35 }}>
              Review your starting points
            </h3>
            <dl className="review-summary">
              {[
                ["Project", d.type, 0],
                [
                  "Context",
                  `${d.location}\n${d.intervention}${d.area ? ` · ${d.area} m²` : ""}\n${d.priorities.join(", ")}`,
                  1,
                ],
                [
                  "Timing / budget",
                  `${d.timeframe || "Not decided"}\n${d.budget || "Not decided"} (${d.currency})`,
                  2,
                ],
                [
                  "References",
                  `${
                    d.references
                      .map((id) => projects.find((p) => p.id === id)?.name)
                      .filter(Boolean)
                      .join(", ") || "None selected"
                  }${d.urls ? "\n" + d.urls : ""}`,
                  3,
                ],
              ].map(([name, value, n]) => (
                <div key={String(name)}>
                  <dt>{name}</dt>
                  <dd>{value}</dd>
                  <button
                    onClick={() => go(Number(n))}
                    aria-label={`Edit ${name}`}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </dl>
            <label className="consent">
              <input
                id="consent"
                type="checkbox"
                checked={d.consent}
                onChange={(e) => update("consent", e.target.checked)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span>
                I understand this is a demo brief saved in this browser. Nothing
                will be sent, and there is no commission or commitment.
              </span>
            </label>
            {errors.consent && (
              <p className="field-error" id="consent-error">
                {errors.consent}
              </p>
            )}
          </>
        )}
        <div className="form-nav">
          {step > 0 ? (
            <button className="back-button" onClick={() => go(step - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          <div>
            <button
              className="button button-outline"
              onClick={() =>
                persist(
                  { ...draft, updatedAt: new Date().toISOString() },
                  "Draft saved.",
                )
              }
            >
              Save draft
            </button>
            {step < 4 ? (
              <button className="button" onClick={() => go(step + 1)}>
                Continue <Icon name="arrow" />
              </button>
            ) : (
              <button className="button" onClick={submit}>
                Save demo brief <Icon name="arrow" />
              </button>
            )}
          </div>
        </div>
        <p className="local-message" role="status">
          {saved || "Changes save automatically in this browser."}
        </p>
      </div>
    </div>
  );
}
