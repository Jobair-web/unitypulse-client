export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

// Event dates are UTC-midnight values, so format them in UTC to avoid a "day before" bug.
export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

export function dateParts(iso) {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "2-digit", timeZone: "UTC" }),
  };
}

export function isPastEvent(iso) {
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return new Date(iso).getTime() < today;
}

export function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const PASSWORD_RULES = [
  { id: "len", label: "At least 6 characters", title: "Password is too short", hint: "Use at least 6 characters.", test: (p) => p.length >= 6 },
  { id: "upper", label: "One uppercase letter (A-Z)", title: "Let's strengthen that password", hint: "Add at least one uppercase letter (A-Z).", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter (a-z)", title: "Let's strengthen that password", hint: "Add at least one lowercase letter (a-z).", test: (p) => /[a-z]/.test(p) },
];

export const firstFailedRule = (p) => PASSWORD_RULES.find((r) => !r.test(p));

// Returns an object of field -> message (empty object means valid). Key order = field order.
export function validateEvent(v, existingDate = "") {
  const e = {};
  const title = v.title.trim();
  const description = v.description.trim();
  const location = v.location.trim();
  if (title.length < 5 || title.length > 80) e.title = "Give your event a name (5 to 80 characters).";
  if (!v.type) e.type = "Pick the kind of drive this is.";
  if (description.length < 30) e.description = "Add a few more details (at least 30 characters).";
  else if (description.length > 600) e.description = "Please keep the description under 600 characters.";
  if (!v.thumbnail.trim()) e.thumbnail = "Add a cover image link so neighbours can see your event.";
  else if (!isValidUrl(v.thumbnail.trim())) e.thumbnail = "That link doesn't look right. Use a full URL starting with https://";
  if (location.length < 3) e.location = "Tell volunteers where to show up.";
  if (!v.eventDate) e.eventDate = "Choose a date for your event.";
  else if (v.eventDate !== existingDate && v.eventDate < tomorrowISO())
    e.eventDate = "Events can only be planned for a future date.";
  return e;
}
