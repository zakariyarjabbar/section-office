"use client";
import { useEffect, useSyncExternalStore } from "react";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  startSync,
  sessionMode,
  resetStore,
  dismissNotice,
} from "@/lib/browser-store";
import { Icon } from "./icons";
export function useDemo() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const s = useDemo();
  useEffect(() => startSync(), []);
  useEffect(() => {
    if (!s.notice) return;
    const id = setTimeout(dismissNotice, 6000);
    return () => clearTimeout(id);
  }, [s.notice]);
  return (
    <>
      {s.error && (
        <div className="storage-warning" role="alert">
          <p>{s.error}</p>
          <div>
            <button onClick={sessionMode}>Use temporary session</button>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Reset saved projects, briefs, inquiries and notes for SECTION OFFICE in this browser?",
                  )
                )
                  resetStore();
              }}
            >
              Reset demo data
            </button>
          </div>
        </div>
      )}
      {s.mode === "session" && (
        <div className="session-banner">
          Temporary session — changes are not saved across refresh.
        </div>
      )}
      {children}
      <div
        className={`toast ${s.notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {s.notice && (
          <>
            <Icon name="check" />
            <span>{s.notice}</span>
            <button
              aria-label="Dismiss notification"
              className="icon-button"
              onClick={dismissNotice}
            >
              <Icon name="close" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
