import { AlertCircle } from "lucide-react";

export const inputClass = (error) =>
  `input w-full h-12 rounded-xl border-input bg-base-100 text-base ${error ? "input-error" : ""}`;

export default function Field({ id, label, required, error, hint, children }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && <span className="text-error" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-sm text-error">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
