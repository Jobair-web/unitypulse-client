import Link from "next/link";
import { Activity } from "lucide-react";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="UnityPulse home">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content">
        <Activity className="size-5" strokeWidth={2.5} />
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? "text-white" : "text-base-content"}`}>
        Unity<span className={light ? "text-emerald-300" : "text-primary"}>Pulse</span>
      </span>
    </Link>
  );
}
