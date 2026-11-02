"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarX } from "lucide-react";
import PrivateRoute, { PageSkeleton } from "@/components/PrivateRoute";
import EventForm from "@/components/EventForm";
import StateBox from "@/components/StateBox";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CONTAINER } from "@/lib/constants";

function Editor() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api(`/events/${id}`)
      .then((d) => alive && setEvent(d.event))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <PageSkeleton />;

  const isOwner = event && session?.user?.email?.toLowerCase() === event.createdBy?.email;
  if (error || !event || !isOwner) {
    return (
      <div className={`${CONTAINER} py-16`}>
        <StateBox
          icon={CalendarX}
          title={event && !isOwner ? "You can only edit your own events" : "We couldn't find that event"}
          text={error || undefined}
          action={<Link href="/events/manage" className="btn btn-primary rounded-full">Back to my events</Link>}
        />
      </div>
    );
  }

  async function handleUpdate(values) {
    await api(`/events/${id}`, { method: "PUT", body: values, auth: true });
    toast.success("Event updated", { description: "Your changes are live." });
    router.push("/events/manage");
  }

  return (
    <div className={`${CONTAINER} py-12 md:py-16`}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold md:text-4xl">Update your event</h1>
        <p className="mb-8 mt-2 text-muted-foreground">Change anything you like. Volunteers will see the new details right away.</p>
        <EventForm
          initial={{
            title: event.title,
            type: event.type,
            description: event.description,
            thumbnail: event.thumbnail,
            location: event.location,
            eventDate: event.eventDate.slice(0, 10),
          }}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
          pendingLabel="Saving…"
          onCancel={() => router.push("/events/manage")}
        />
      </div>
    </div>
  );
}

export default function EditEventView() {
  return (
    <PrivateRoute>
      <Editor />
    </PrivateRoute>
  );
}
