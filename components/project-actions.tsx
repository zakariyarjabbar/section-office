"use client";
import { useState } from "react";
import { useDemo } from "./store";
import { mutate } from "@/lib/browser-store";
import { toggleSaved } from "@/lib/state";
import { Icon } from "./icons";
export function SaveButton({
  id,
  compact = false,
}: {
  id: string;
  compact?: boolean;
}) {
  const s = useDemo();
  const saved = s.state.saved.includes(id);
  return (
    <button
      className={compact ? "icon-button save-compact" : "button button-outline"}
      aria-label={saved ? "Remove saved project" : "Save project"}
      aria-pressed={saved}
      disabled={!s.hydrated}
      onClick={() =>
        mutate(
          (state) => toggleSaved(state, id),
          saved
            ? "Project removed from your references."
            : "Project saved to your references.",
        )
      }
    >
      <Icon name={saved ? "check" : "bookmark"} />
      {!compact && (saved ? "Project saved" : "Save project")}
    </button>
  );
}
export function ProjectActions({
  id,
  name,
  url,
}: {
  id: string;
  name: string;
  url: string;
}) {
  const [feedback, setFeedback] = useState("");
  async function share() {
    try {
      const publicUrl = new URL(new URL(url).pathname, window.location.origin)
        .href;
      if (navigator.share) {
        await navigator.share({
          title: `${name} — SECTION OFFICE`,
          url: publicUrl,
        });
        setFeedback("Share completed.");
      } else {
        await navigator.clipboard.writeText(publicUrl);
        setFeedback("Project link copied.");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setFeedback(
        "Could not share automatically. Copy this page’s address from your browser.",
      );
    }
  }
  return (
    <div className="project-actions">
      <SaveButton id={id} />
      <button className="button button-outline" onClick={share}>
        <Icon name="share" />
        Share project
      </button>
      <span role="status" className="small">
        {feedback}
      </span>
    </div>
  );
}
