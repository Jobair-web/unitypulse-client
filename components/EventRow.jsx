import { MapPin } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import TypePill from "@/components/TypePill";
import { formatDate } from "@/lib/utils";

export default function EventRow({ event, badge, actions, dim = false }) {
  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center ${
        dim ? "opacity-75" : ""
      }`}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-base-300 sm:size-24">
        <SafeImage src={event.thumbnail} />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <TypePill type={event.type} />
          {badge}
        </div>
        <h3 className="truncate font-display text-lg font-semibold">{event.title}</h3>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{formatDate(event.eventDate)}</span>
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{event.location}</span>
          </span>
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
    </article>
  );
}
