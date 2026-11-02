"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarX } from "lucide-react";
import { api } from "@/lib/api";
import EventsGrid from "@/components/EventsGrid";
import SectionHeading from "@/components/SectionHeading";
import StateBox from "@/components/StateBox";
import { CONTAINER } from "@/lib/constants";

export default function UpcomingEvents() {
  const [state, setState] = useState({ loading: true, events: [], error: "" });

  useEffect(() => {
    let alive = true;
    api("/events?limit=6")
      .then((d) => alive && setState({ loading: false, events: d.events, error: "" }))
      .catch((e) => alive && setState({ loading: false, events: [], error: e.message }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="bg-base-100/50 py-16 md:py-24">
      <div className={CONTAINER}>
        <SectionHeading
          eyebrow="Recent upcoming events"
          title="Happening soon"
          subtitle="Pick a day, bring a friend, make someone's winter warmer."
          action={
            <Link href="/events" className="btn btn-ghost rounded-full text-primary">
              View all events →
            </Link>
          }
        />
        <EventsGrid
          loading={state.loading}
          events={state.events}
          error={state.error}
          empty={
            <StateBox
              icon={CalendarX}
              title="No upcoming events yet"
              text="Be the first to host a drive in your neighbourhood."
              action={<Link href="/events/create" className="btn btn-primary rounded-full">Create an event</Link>}
            />
          }
        />
      </div>
    </section>
  );
}
