"use client";

import { CalendarX } from "lucide-react";
import EventCard, { EventCardSkeleton } from "@/components/EventCard";
import StateBox from "@/components/StateBox";

export default function EventsGrid({ loading, events, error, empty }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) return <StateBox icon={CalendarX} title="We couldn't load the events" text={error} />;
  if (!events.length) return empty;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
