"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { mutate } from "@/lib/browser-store";
import { useDemo } from "./store";
import { Field, ErrorSummary } from "./forms";
import { Icon } from "./icons";
export function ContactForm() {
  const s = useDemo();
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const lock = useRef(false);
  function send(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    const err: Record<string, string> = {};
    if (data.name.trim().length < 2)
      err.name = "Add a name or use sample details.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      err.email = "Enter a valid email address.";
    if (data.message.trim().length < 20)
      err.message = "Add at least 20 characters about your idea.";
    setErrors(err);
    if (Object.keys(err).length) return;
    lock.current = true;
    const ok = mutate(
      (state) => ({
        ...state,
        inquiries: [
          {
            id: crypto.randomUUID(),
            ...data,
            createdAt: new Date().toISOString(),
            status: "New" as const,
            notes: "",
          },
          ...state.inquiries,
        ].slice(0, 200),
      }),
      "Demo inquiry saved. Nothing was sent.",
    );
    if (ok) setDone(true);
    else lock.current = false;
  }
  if (done)
    return (
      <div className="success-panel">
        <div className="success-mark">
          <Icon name="check" />
        </div>
        <h2>
          {s.mode === "session"
            ? "Inquiry kept for this session."
            : "Demo inquiry saved in this browser."}
        </h2>
        <p>
          No email was sent. You can see and manage this inquiry in the local
          demonstration inbox.
        </p>
        <Link className="button" href="/demo/inbox/">
          Review in demo inbox <Icon name="arrow" />
        </Link>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={send} noValidate>
      <p>This demo saves locally in your browser and sends nothing.</p>
      <div className="brief-tools">
        <button
          type="button"
          onClick={() => {
            setData({
              name: "Alex Example",
              email: "alex@example.com",
              message:
                "I am exploring a small renovation with more shared light and a better relationship to the garden. I would like to understand a possible starting point.",
            });
            setErrors({});
          }}
        >
          Use sample details
        </button>
      </div>
      <ErrorSummary errors={errors} />
      <div className="form-row">
        <Field
          name="name"
          label="Name"
          autoComplete="name"
          value={data.name}
          maxLength={100}
          error={errors.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={data.email}
          maxLength={254}
          error={errors.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </div>
      <Field
        name="message"
        label="What do you have in mind?"
        error={errors.message}
      >
        <textarea
          id="message"
          value={data.message}
          maxLength={4000}
          onChange={(e) => setData({ ...data, message: e.target.value })}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>
      <button className="button" type="submit" disabled={!s.hydrated}>
        Save demo inquiry <Icon name="arrow" />
      </button>
      <p className="local-message">
        A local demonstration. No message delivery or commission is created.
      </p>
    </form>
  );
}
