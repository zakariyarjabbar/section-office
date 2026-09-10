"use client";
import type { InputHTMLAttributes } from "react";
export function Field({
  label,
  name,
  error,
  hint,
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children || (
        <input
          id={name}
          name={name}
          aria-invalid={!!error}
          aria-describedby={
            [error ? `${name}-error` : "", hint ? `${name}-hint` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...props}
        />
      )}{" "}
      {hint && <small id={`${name}-hint`}>{hint}</small>}
      {error && (
        <span className="field-error" id={`${name}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  return Object.keys(errors).length ? (
    <div className="error-summary" role="alert" tabIndex={-1}>
      <strong>A few details need your attention.</strong>
      <ul>
        {Object.entries(errors).map(([key, value]) => (
          <li key={key}>
            <a href={`#${key}`}>{value}</a>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
