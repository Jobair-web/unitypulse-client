import Link from "next/link";
import { MapPin, CalendarDays, Users } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import TypePill from "@/components/TypePill";
import Skeleton from "@/components/Skeleton";
import { dateParts, formatDate } from "@/lib/utils";

export default function EventCard({ event }) {
  const { month, day } = dateParts(event.eventDate);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-base-200 motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-base-300">
        <SafeImage
          src={event.thumbnail}
          className="transition-transform duration-500 motion-safe:group-hover:scale-105 dark:brightness-90"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        <time
          dateTime={event.eventDate}
          className="absolute left-3 top-3 rounded-xl bg-base-100/85 px-2.5 py-1.5 text-center shadow-sm backdrop-blur-md"
        >
          <span className="block text-xs font-bold uppercase tracking-wider text-primary">{month}</span>
          <span className="block font-display text-xl font-bold leading-none">{day}</span>
        </time>
        <TypePill type={event.type} className="absolute right-3 top-3 backdrop-blur-md" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-lg font-semibold leading-snug">{event.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{event.location}</span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4 shrink-0 text-primary" />
          {formatDate(event.eventDate)}
        </p>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{event.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-base-300 pt-4">
          <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Users className="size-4" />
            {event.participantsCount || 0} joined
          </p>
          <Link
            href={`/events/${event._id}`}
            className="btn btn-primary btn-sm h-10 rounded-full px-5 after:absolute after:inset-0"
          >
            View Event
          </Link>
        </div>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-full" />
        <div className="mt-auto flex items-center justify-between border-t border-base-300 pt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
