import { emptyEnvelope, Envelope, parseEnvelope, STORAGE_KEY } from "./state";
export type Snapshot = {
  state: Envelope;
  hydrated: boolean;
  mode: "persistent" | "session";
  error: string;
  notice: string;
};
const initial: Snapshot = {
  state: emptyEnvelope(),
  hydrated: false,
  mode: "persistent",
  error: "",
  notice: "",
};
let snapshot = initial;
const listeners = new Set<() => void>();
export const getSnapshot = () => snapshot;
export const getServerSnapshot = () => initial;
export const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
function emit(next: Snapshot) {
  snapshot = next;
  listeners.forEach((fn) => fn());
}
export function hydrate() {
  try {
    emit({
      ...snapshot,
      state: parseEnvelope(window.localStorage.getItem(STORAGE_KEY)),
      hydrated: true,
      error: "",
    });
  } catch (e) {
    emit({
      ...snapshot,
      hydrated: true,
      error: e instanceof Error ? e.message : "Browser storage is unavailable.",
    });
  }
}
export function mutate(fn: (s: Envelope) => Envelope, notice = ""): boolean {
  if (!snapshot.hydrated) return false;
  try {
    const latest =
      snapshot.mode === "session"
        ? snapshot.state
        : parseEnvelope(window.localStorage.getItem(STORAGE_KEY));
    const next = fn(latest);
    if (snapshot.mode === "persistent")
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emit({
      ...snapshot,
      state: next,
      error: "",
      notice:
        snapshot.mode === "session" && notice
          ? `${notice} Temporary session only.`
          : notice,
    });
    return true;
  } catch (e) {
    emit({
      ...snapshot,
      error: `${e instanceof Error ? e.message : "Storage failed."} This change was not saved. Use a temporary session or reset this demo.`,
    });
    return false;
  }
}
export function sessionMode() {
  emit({
    ...snapshot,
    mode: "session",
    error: "",
    notice:
      "Temporary session enabled. Changes will be lost when this page is closed or refreshed.",
  });
}
export function resetStore(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    emit({
      ...initial,
      hydrated: true,
      notice: "This demo’s local data was reset.",
    });
    return true;
  } catch {
    emit({
      ...snapshot,
      error:
        "Browser storage cannot be reset here. You can use a temporary session.",
    });
    return false;
  }
}
export function dismissNotice() {
  emit({ ...snapshot, notice: "" });
}
export function startSync() {
  hydrate();
  const handle = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && snapshot.mode === "persistent") hydrate();
  };
  window.addEventListener("storage", handle);
  return () => window.removeEventListener("storage", handle);
}
