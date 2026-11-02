import { TYPE_STYLES } from "@/lib/constants";

export default function TypePill({ type, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
        TYPE_STYLES[type] || TYPE_STYLES.Other
      } ${className}`}
    >
      {type}
    </span>
  );
}
