"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle, Users } from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";
import EventRow from "@/components/EventRow";
import ConfirmDialog from "@/components/ConfirmDialog";
import Skeleton from "@/components/Skeleton";
import StateBox from "@/components/StateBox";
import { api } from "@/lib/api";
import { CONTAINER } from "@/lib/constants";
import { isPastEvent } from "@/lib/utils";

function Content() {
  const [state, setState] = useState({ loading: true, events: [], error: "" });
  const [target, setTarget] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let alive = true;
    api("/events/mine", { auth: true })
      .then((d) => alive && setState({ loading: false, events: d.events, error: "" }))
      .catch((e) => alive && setState({ loading: false, events: [], error: e.message }));
    return () => {
      alive = false;
    };
  }, []);

  async function handleDelete() {
    setPending(true);
    try {
      await api(`/events/${target._id}`, { method: "DELETE", auth: true });
      setState((s) => ({ ...s, events: s.events.filter((e) => e._id !== target._id) }));
      toast.success("Event deleted", { description: "It has been removed for everyone." });
      setTarget(null);
    } catch (e) {
      toast.error("Couldn't delete the event", { description: e.message });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={`${CONTAINER} py-12 md:py-16`}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Your events</h1>
          <p className="mt-2 text-muted-foreground">Edit details or remove a drive. Only you can change what you created.</p>
        </div>
        <Link href="/events/create" className="btn btn-primary rounded-full"><PlusCircle className="size-4" /> Create event</Link>
      </div>

      {state.loading ? (
        <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      ) : state.error ? (
        <StateBox title="We couldn't load your events" text={state.error} />
      ) : state.events.length === 0 ? (
        <StateBox
          icon={PlusCircle}
          title="You haven't hosted anything yet"
          text="Your first drive could warm a whole street."
          action={<Link href="/events/create" className="btn btn-primary rounded-full">Create your first event</Link>}
        />
      ) : (
        <div className="grid gap-4">
          {state.events.map((event) => {
            const past = isPastEvent(event.eventDate);
            return (
              <EventRow
                key={event._id}
                event={event}
                dim={past}
                badge={
                  <>
                    <span className={`badge badge-soft ${past ? "badge-ghost" : "badge-success"}`}>{past ? "Ended" : "Upcoming"}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Users className="size-3.5" />{event.participantsCount || 0} joined</span>
                  </>
                }
                actions={
                  <>
                    <Link href={`/events/${event._id}`} className="btn btn-ghost btn-sm h-10 rounded-full">View</Link>
                    <Link href={`/events/${event._id}/edit`} className="btn btn-outline btn-primary btn-sm h-10 rounded-full"><Pencil className="size-4" /> Update</Link>
                    <button onClick={() => setTarget(event)} className="btn btn-ghost btn-sm h-10 rounded-full text-error"><Trash2 className="size-4" /> Delete</button>
                  </>
                }
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete this event?"
        description={target ? `"${target.title}" has ${target.participantsCount || 0} volunteers signed up. It will be removed for everyone and this can't be undone.` : ""}
        confirmLabel="Delete event"
        cancelLabel="Keep event"
        pending={pending}
        onConfirm={handleDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}

export default function ManageEventsView() {
  return (
    <PrivateRoute>
      <Content />
    </PrivateRoute>
  );
}
