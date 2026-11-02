"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";
import Field, { inputClass } from "@/components/Field";
import SafeImage from "@/components/SafeImage";
import { EVENT_TYPES } from "@/lib/constants";
import { formatDate, isValidUrl, tomorrowISO, validateEvent } from "@/lib/utils";

const EMPTY = { title: "", type: "", description: "", thumbnail: "", location: "", eventDate: "" };

/**
 * Shared by Create Event and Update Event.
 * onSubmit(values) should throw an Error to show a failure; the form handles the pending state.
 */
export default function EventForm({ initial, onSubmit, submitLabel, pendingLabel, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const existingDate = initial?.eventDate || "";
  const minDate = tomorrowISO();

  const change = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validateEvent(next, existingDate)[name] }));
  };
  const blur = (name) => () =>
    setErrors((prev) => ({ ...prev, [name]: validateEvent(values, existingDate)[name] }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateEvent(values, existingDate);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      toast.error("Couldn't save your event", { description: "Check the highlighted fields and try again." });
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setPending(true);
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        thumbnail: values.thumbnail.trim(),
        location: values.location.trim(),
      });
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      toast.error("Couldn't save your event", { description: err.message });
    } finally {
      setPending(false);
    }
  }

  const aria = (name) => ({
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-card md:p-8"
    >
      <Field id="title" label="Event title" required error={errors.title} hint="A clear, friendly name works best.">
        <input
          id="title"
          className={inputClass(errors.title)}
          value={values.title}
          onChange={change("title")}
          onBlur={blur("title")}
          placeholder="e.g. Winter Clothes Distribution, Mirpur 10"
          maxLength={80}
          {...aria("title")}
        />
      </Field>

      <Field id="type" label="Event type" required error={errors.type}>
        <select
          id="type"
          className={`select w-full h-12 rounded-xl border-input bg-base-100 text-base ${errors.type ? "select-error" : ""}`}
          value={values.type}
          onChange={change("type")}
          onBlur={blur("type")}
          {...aria("type")}
        >
          <option value="" disabled>Choose a type</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field
        id="description"
        label="Description"
        required
        error={errors.description}
        hint="Tell neighbours what to bring, who it helps and where to meet."
      >
        <textarea
          id="description"
          rows={5}
          className={`textarea w-full rounded-xl border-input bg-base-100 text-base ${errors.description ? "textarea-error" : ""}`}
          value={values.description}
          onChange={change("description")}
          onBlur={blur("description")}
          maxLength={600}
          placeholder="Sort, pack and hand out warm clothes to families before the cold snap."
          {...aria("description")}
        />
        <p className="text-right text-xs text-muted-foreground">{values.description.length} / 600</p>
      </Field>

      <Field
        id="thumbnail"
        label="Thumbnail image URL"
        required
        error={errors.thumbnail}
        hint="Paste a link to a bright, real photo (https://...)."
      >
        <input
          id="thumbnail"
          type="url"
          className={inputClass(errors.thumbnail)}
          value={values.thumbnail}
          onChange={change("thumbnail")}
          onBlur={blur("thumbnail")}
          placeholder="https://example.com/photo.jpg"
          {...aria("thumbnail")}
        />
        {isValidUrl(values.thumbnail.trim()) && (
          <div className="relative mt-1 aspect-[16/9] w-full max-w-sm overflow-hidden rounded-2xl bg-base-300">
            <SafeImage src={values.thumbnail.trim()} alt="Thumbnail preview" />
          </div>
        )}
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="location" label="Location" required error={errors.location} hint="Where should people meet?">
          <input
            id="location"
            className={inputClass(errors.location)}
            value={values.location}
            onChange={change("location")}
            onBlur={blur("location")}
            placeholder="e.g. Mirpur 10 Community Field, Dhaka"
            {...aria("location")}
          />
        </Field>

        <Field
          id="eventDate"
          label="Event date"
          required
          error={errors.eventDate}
          hint={`Only upcoming days can be picked, starting ${formatDate(minDate)}.`}
        >
          <div className="relative">
            <input
              id="eventDate"
              type="date"
              min={minDate}
              className={inputClass(errors.eventDate)}
              value={values.eventDate}
              onChange={change("eventDate")}
              onBlur={blur("eventDate")}
              {...aria("eventDate")}
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 hidden size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost h-12 rounded-full">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="btn btn-primary h-12 min-w-44 rounded-full px-6 font-semibold"
        >
          {pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
