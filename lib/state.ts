export const STORAGE_KEY = "section-office:demo:v1";
export const PROJECT_IDS = [
  "fold-house",
  "foundry-hall",
  "common-ground",
  "quarry-rooms",
  "frame-apartment",
  "field-pavilion",
  "northlight-studio",
  "passage-gallery",
];
export const TYPES = [
  "Home",
  "Interior",
  "Workplace",
  "Hospitality",
  "Cultural / commercial",
  "Other",
];
export const PRIORITIES = [
  "Daylight",
  "Flexible use",
  "Material character",
  "Privacy",
  "Connection to outdoors",
  "Retaining the existing",
];
export const STATUSES = ["New", "Reviewing", "Archived"] as const;
export type Status = (typeof STATUSES)[number];
export type BriefData = {
  type: string;
  location: string;
  intervention: string;
  area: string;
  priorities: string[];
  timeframe: string;
  budget: string;
  currency: string;
  references: string[];
  urls: string;
  name: string;
  email: string;
  summary: string;
  consent: boolean;
};
export type Brief = {
  id: string;
  reference: string;
  kind: "draft" | "submitted";
  step: number;
  data: BriefData;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  status: Status;
  notes: string;
};
export type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: Status;
  notes: string;
};
export type Envelope = {
  version: 1;
  saved: string[];
  view: "grid" | "list";
  briefs: Brief[];
  inquiries: Inquiry[];
};
export const emptyEnvelope = (): Envelope => ({
  version: 1,
  saved: [],
  view: "grid",
  briefs: [],
  inquiries: [],
});
export const emptyBrief = (): BriefData => ({
  type: "",
  location: "",
  intervention: "",
  area: "",
  priorities: [],
  timeframe: "Not decided",
  budget: "Not decided",
  currency: "USD",
  references: [],
  urls: "",
  name: "",
  email: "",
  summary: "",
  consent: false,
});
export const sampleBrief = (): BriefData => ({
  ...emptyBrief(),
  type: "Home",
  location: "A temperate town edge",
  intervention: "New build",
  area: "140",
  priorities: ["Daylight", "Connection to outdoors"],
  timeframe: "Exploring possibilities",
  budget: "Not decided",
  name: "Alex Example",
  email: "alex@example.com",
  summary:
    "A compact home with a sheltered outdoor space, a quiet place to read and a flexible room for working from home. We are exploring how the rooms could share light.",
  references: ["fold-house", "common-ground"],
});
const obj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.slice(0, max) : "";
const ids = (v: unknown) =>
  Array.isArray(v)
    ? [
        ...new Set(
          v.filter(
            (s): s is string =>
              typeof s === "string" && PROJECT_IDS.includes(s),
          ),
        ),
      ]
    : [];
const status = (v: unknown): Status =>
  STATUSES.includes(v as Status) ? (v as Status) : "New";
const validDate = (v: unknown): v is string =>
  typeof v === "string" && Number.isFinite(Date.parse(v));
export function normalizeData(v: unknown): BriefData {
  if (!obj(v)) return emptyBrief();
  const d = emptyBrief();
  for (const k of [
    "type",
    "location",
    "intervention",
    "area",
    "timeframe",
    "budget",
    "currency",
    "urls",
    "name",
    "email",
    "summary",
  ] as const)
    d[k] = clean(v[k], k === "urls" ? 2000 : k === "summary" ? 4000 : 300);
  d.references = ids(v.references);
  d.priorities = Array.isArray(v.priorities)
    ? v.priorities.filter(
        (p): p is string => typeof p === "string" && PRIORITIES.includes(p),
      )
    : [];
  d.consent = v.consent === true;
  return d;
}
export function parseEnvelope(raw: string | null): Envelope {
  if (raw === null) return emptyEnvelope();
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    throw new Error(
      "Saved data could not be read. It has not been overwritten.",
    );
  }
  if (!obj(v)) throw new Error("Saved data has an invalid format.");
  if (v.version === 0)
    v = {
      ...v,
      version: 1,
      saved: v.savedIds ?? [],
      briefs: [],
      inquiries: [],
    };
  if (!obj(v) || v.version !== 1)
    throw new Error(
      "This saved-data version is unsupported. Reset it or use a temporary session.",
    );
  if (
    !Array.isArray(v.briefs) ||
    !Array.isArray(v.inquiries) ||
    !Array.isArray(v.saved)
  )
    throw new Error("Saved data is incomplete. It has not been overwritten.");
  const briefs: Brief[] = [];
  const seen = new Set<string>();
  for (const b of v.briefs.slice(0, 200)) {
    if (
      !obj(b) ||
      typeof b.id !== "string" ||
      !/^[-a-zA-Z0-9]{1,100}$/.test(b.id) ||
      seen.has(b.id) ||
      !validDate(b.createdAt) ||
      !validDate(b.updatedAt) ||
      !["draft", "submitted"].includes(String(b.kind))
    )
      continue;
    if (b.kind === "submitted" && !validDate(b.submittedAt)) continue;
    seen.add(b.id);
    briefs.push({
      id: b.id,
      reference: clean(b.reference, 50),
      kind: b.kind as Brief["kind"],
      step: Math.min(
        4,
        Math.max(0, Number.isInteger(b.step) ? Number(b.step) : 0),
      ),
      data: normalizeData(b.data),
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      submittedAt: validDate(b.submittedAt) ? b.submittedAt : undefined,
      status: status(b.status),
      notes: clean(b.notes, 4000),
    });
  }
  const inquiries: Inquiry[] = [];
  for (const q of v.inquiries.slice(0, 200))
    if (
      obj(q) &&
      typeof q.id === "string" &&
      /^[-a-zA-Z0-9]{1,100}$/.test(q.id) &&
      validDate(q.createdAt) &&
      !seen.has(q.id)
    ) {
      seen.add(q.id);
      inquiries.push({
        id: q.id,
        name: clean(q.name, 100),
        email: clean(q.email, 254),
        message: clean(q.message, 4000),
        createdAt: q.createdAt,
        status: status(q.status),
        notes: clean(q.notes, 4000),
      });
    }
  return {
    version: 1,
    saved: ids(v.saved),
    view: v.view === "list" ? "list" : "grid",
    briefs,
    inquiries,
  };
}
export function toggleSaved(state: Envelope, id: string): Envelope {
  if (!PROJECT_IDS.includes(id)) return state;
  return {
    ...state,
    saved: state.saved.includes(id)
      ? state.saved.filter((x) => x !== id)
      : [...state.saved, id],
  };
}
export function validUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return (
      ["http:", "https:"].includes(u.protocol) &&
      !u.username &&
      !u.password &&
      !!u.hostname
    );
  } catch {
    return false;
  }
}
export function validateBrief(
  d: BriefData,
  step?: number,
): Record<string, string> {
  const e: Record<string, string> = {};
  const check = (n: number) => step === undefined || step === n;
  if (check(0) && !TYPES.includes(d.type)) e.type = "Choose a project type.";
  if (check(1)) {
    if (d.location.trim().length < 2)
      e.location = "Add a broad location or write “Not decided”.";
    if (
      !["New build", "Renovation", "Adaptive reuse", "Not decided"].includes(
        d.intervention,
      )
    )
      e.intervention = "Choose the kind of work.";
    if (
      d.area &&
      (!/^\d+(\.\d+)?$/.test(d.area) ||
        Number(d.area) <= 0 ||
        Number(d.area) > 1000000)
    )
      e.area = "Enter an area between 1 and 1,000,000 m², or leave this blank.";
    if (!d.priorities.length) e.priorities = "Choose at least one priority.";
  }
  if (
    check(3) &&
    d.urls
      .split(/\n/)
      .filter((s) => s.trim())
      .some((s) => !validUrl(s.trim()))
  )
    e.urls =
      "Use complete http:// or https:// links, one per line, without sign-in details.";
  if (check(4)) {
    if (d.name.trim().length < 2)
      e.name = "Add your name, or use the sample data.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || d.email.length > 254)
      e.email = "Enter a valid email address.";
    if (d.summary.trim().length < 20)
      e.summary = "Tell us a little more — at least 20 characters.";
    if (!d.consent) e.consent = "Confirm that this is a local demo submission.";
  }
  return e;
}
export function saveBrief(
  state: Envelope,
  brief: Brief,
  submit = false,
): Envelope {
  const existing = state.briefs.find((b) => b.id === brief.id);
  if (existing?.kind === "submitted") return state;
  if (submit && Object.keys(validateBrief(brief.data)).length)
    throw new Error("The brief is not ready to submit.");
  const next = {
    ...brief,
    kind: submit ? ("submitted" as const) : ("draft" as const),
    submittedAt: submit ? brief.updatedAt : undefined,
  };
  return {
    ...state,
    briefs: [next, ...state.briefs.filter((b) => b.id !== brief.id)].slice(
      0,
      200,
    ),
  };
}
export function newBrief(data: BriefData = emptyBrief()): Brief {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  return {
    id,
    reference: `SO-${id.slice(0, 8).toUpperCase()}`,
    kind: "draft",
    step: 0,
    data,
    createdAt: now,
    updatedAt: now,
    status: "New",
    notes: "",
  };
}
export function parseFilters(params: URLSearchParams, categories: string[]) {
  const category = params.get("category") || "";
  return {
    category: categories.includes(category) ? category : "",
    query: (params.get("q") || "").slice(0, 100),
  };
}
export function briefText(b: Brief): string {
  const d = b.data;
  return `SECTION / OFFICE\n${b.reference} — ${b.kind === "submitted" ? "Submitted demo brief" : "Draft"}\nStatus: ${b.status}\nUpdated: ${b.updatedAt}\n\nPROJECT\nType: ${d.type}\nContext: ${d.location}\nWork: ${d.intervention}\nArea: ${d.area ? `${d.area} m² (self-reported)` : "Not decided"}\nPriorities: ${d.priorities.join(", ")}\nTimeframe: ${d.timeframe || "Not decided"}\nBudget: ${d.budget || "Not decided"} (${d.currency}) — self-reported, not an estimate\n\nREFERENCES\n${d.references.join(", ") || "None"}\n${d.urls}\n\nCONTACT\n${d.name}\n${d.email}\n\nBRIEF\n${d.summary}\n\nThis is a self-initiated portfolio demonstration. Saved in this browser; no message was sent.\n`;
}
