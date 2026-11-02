export const EVENT_TYPES = [
  "Cleanup", "Plantation", "Donation", "Clothing", "Food", "Health", "Education", "Blood Drive", "Other",
];

// Full class strings so Tailwind can detect them
export const TYPE_STYLES = {
  Cleanup: "bg-teal-100 text-teal-900 dark:bg-teal-400/15 dark:text-teal-300",
  Plantation: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-300",
  Donation: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
  Clothing: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
  Food: "bg-orange-100 text-orange-900 dark:bg-orange-400/15 dark:text-orange-300",
  Health: "bg-sky-100 text-sky-900 dark:bg-sky-400/15 dark:text-sky-300",
  Education: "bg-violet-100 text-violet-900 dark:bg-violet-400/15 dark:text-violet-300",
  "Blood Drive": "bg-rose-100 text-rose-900 dark:bg-rose-400/15 dark:text-rose-300",
  Other: "bg-slate-200 text-slate-900 dark:bg-slate-400/15 dark:text-slate-300",
};

export const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
