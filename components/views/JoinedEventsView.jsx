"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";
import EventRow from "@/components/EventRow";
import ConfirmDialog from "@/components/ConfirmDialog";
import Skeleton from "@/components/Skeleton";
import StateBox from "@/components/StateBox";
import { api } from "@/lib/api";
import { CONTAINER } from "@/lib/constants";
import { isPastEvent } from "@/lib/utils";

function Section({ title, items, past, onLeave }) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title} <span className="text-muted-foreground">({items.length})</span></h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <EventRow
            key={item._id}
            event={item.event}
            dim={past}
            badge={<span className={`badge badge-soft ${past ? "badge-ghost" : "badge-success"}`}>{past ? "Completed" : "You're going"}</span>}
            actions={
              <>
                <Link href={`/events/${item.event._id}`} className="btn btn-primary btn-sm h-10 rounded-full">View Event</Link>
                {!past && (
                  <button onClick={() => onLeave(item)} className="btn btn-ghost btn-sm h-10 rounded-full text-error">Leave</button>
                )}
              </>
            }
          />
        ))}
      </div>
    </section>
  );
}

function Content() {
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  const [target, setTarget] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let alive = true;
    api("/joined", { auth: true })
      .then((d) => alive && setState({ loading: false, items: d.joined, error: "" }))
      .catch((e) => alive && setState({ loading: false, items: [], error: e.message }));
    return () => {
      alive = false;
    };
  }, []);

  async function handleLeave() {
    setPending(true);
    try {
      await api(`/events/${target.event._id}/join`, { method: "DELETE", auth: true });
      setState((s) => ({ ...s, items: s.items.filter((i) => i._id !== target._id) }));
      toast.success("You've left the event", { description: "Your spot will go to someone else." });
      setTarget(null);
    } catch (e) {
      toast.error("Couldn't leave the event", { description: e.message });
    } finally {
      setPending(false);
    }
  }

  // The API already sorts by event date (soonest first)
  const upcoming = state.items.filter((i) => !isPastEvent(i.event.eventDate));
  const past = state.items.filter((i) => isPastEvent(i.event.eventDate));

  return (
    <div className={`${CONTAINER} py-12 md:py-16`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Your joined events</h1>
        <p className="mt-2 text-muted-foreground">Everything you've signed up for, sorted by event date.</p>
      </div>

      {state.loading ? (
        <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      ) : state.error ? (
        <StateBox title="We couldn't load your events" text={state.error} />
      ) : state.items.length === 0 ? (
        <StateBox
          icon={CheckCircle2}
          title="You haven't joined anything yet"
          text="Your first one is only a tap away."
          action={<Link href="/events" className="btn btn-primary rounded-full">Browse upcoming events</Link>}
        />
      ) : (
        <div className="space-y-10">
          <Section title="Upcoming" items={upcoming} onLeave={setTarget} />
          <Section title="Past" items={past} past onLeave={setTarget} />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        title="Leave this event?"
        description="Your spot will go to someone else. You can always join again later if there's space."
        confirmLabel="Leave event"
        cancelLabel="Stay"
        pending={pending}
        onConfirm={handleLeave}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}

export default function JoinedEventsView() {
  return (
    <PrivateRoute>
      <Content />
    </PrivateRoute>
  );
}
