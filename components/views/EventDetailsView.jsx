"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, MapPin, Users, CheckCircle2, CalendarX } from "lucide-react";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import SafeImage from "@/components/SafeImage";
import TypePill from "@/components/TypePill";
import Avatar from "@/components/Avatar";
import Skeleton from "@/components/Skeleton";
import StateBox from "@/components/StateBox";
import { CONTAINER } from "@/lib/constants";
import { formatDate, isPastEvent } from "@/lib/utils";

function DetailsSkeleton() {
  return (
    <div className={`${CONTAINER} space-y-8 py-8`}>
      <Skeleton className="h-64 w-full rounded-3xl sm:h-80 lg:h-[26rem]" />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-72 rounded-2xl lg:col-span-4" />
      </div>
    </div>
  );
}

export default function EventDetailsView() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ joined: false, isOwner: false });
  const [busy, setBusy] = useState(false);

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

  useEffect(() => {
    if (!user) {
      setStatus({ joined: false, isOwner: false });
      return;
    }
    api(`/events/${id}/status`, { auth: true }).then(setStatus).catch(() => {});
  }, [id, user]);

  async function handleJoin() {
    if (!user) {
      toast.info("Please sign in to continue", { description: "We'll bring you right back here." });
      router.push(`/login?redirect=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }
    setBusy(true);
    try {
      const r = await api(`/events/${id}/join`, { method: "POST", auth: true });
      setStatus((s) => ({ ...s, joined: true }));
      setEvent((e) => ({ ...e, participantsCount: r.participantsCount }));
      toast.success("You've joined the drive", { description: "Added to your Joined Events. See you there!" });
    } catch (e) {
      toast.error("Couldn't join this event", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave() {
    setBusy(true);
    try {
      const r = await api(`/events/${id}/join`, { method: "DELETE", auth: true });
      setStatus((s) => ({ ...s, joined: false }));
      setEvent((e) => ({ ...e, participantsCount: r.participantsCount }));
      toast.success("You've left the event", { description: "Your spot is free for someone else." });
    } catch (e) {
      toast.error("Couldn't leave this event", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <DetailsSkeleton />;
  if (error || !event) {
    return (
      <div className={`${CONTAINER} py-16`}>
        <StateBox
          icon={CalendarX}
          title="We couldn't find that event"
          text={error || "It may have been removed by its host."}
          action={<Link href="/events" className="btn btn-primary rounded-full">Browse upcoming events</Link>}
        />
      </div>
    );
  }

  const past = isPastEvent(event.eventDate);

  let cta;
  if (status.isOwner) {
    cta = <Link href="/events/manage" className="btn btn-outline btn-primary h-12 w-full rounded-full">Manage your event</Link>;
  } else if (past) {
    cta = <button disabled className="btn btn-disabled h-12 w-full rounded-full">This event has ended</button>;
  } else if (status.joined) {
    cta = (
      <div className="space-y-2 text-center">
        <button disabled className="btn btn-success btn-soft h-12 w-full rounded-full disabled:opacity-100">
          <CheckCircle2 className="size-5" /> You're in
        </button>
        <button onClick={handleLeave} disabled={busy} className="link text-sm text-muted-foreground">Leave event</button>
      </div>
    );
  } else {
    cta = (
      <button onClick={handleJoin} disabled={busy} aria-busy={busy} className="btn btn-primary h-12 w-full rounded-full font-semibold">
        {busy && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
        {busy ? "Joining…" : user ? "Join Event" : "Sign in to join"}
      </button>
    );
  }

  return (
    <div className={`${CONTAINER} py-8 pb-24 lg:pb-12`}>
      <Link href="/events" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back to events
      </Link>

      <div className="relative h-64 overflow-hidden rounded-3xl bg-base-300 sm:h-80 lg:h-[26rem]">
        <SafeImage src={event.thumbnail} alt={event.title} className="dark:brightness-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <TypePill type={event.type} className="absolute left-4 top-4 backdrop-blur-md sm:left-6 sm:top-6" />
        <h1 className="absolute inset-x-4 bottom-5 text-2xl font-bold leading-tight text-white drop-shadow sm:inset-x-8 sm:bottom-8 sm:text-4xl lg:text-5xl">
          {event.title}
        </h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">About this event</h2>
            <p className="max-w-prose whitespace-pre-line text-base leading-relaxed text-muted-foreground">{event.description}</p>
          </section>

          <section className="flex items-center gap-4 rounded-2xl bg-base-100 p-4 shadow-card">
            <Avatar user={event.createdBy} className="size-12" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hosted by</p>
              <p className="truncate font-semibold">{event.createdBy?.name || "A UnityPulse member"}</p>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-5 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" />
              <div><p className="text-sm text-muted-foreground">Date</p><p className="font-semibold">{formatDate(event.eventDate)}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div><p className="text-sm text-muted-foreground">Location</p><p className="font-semibold">{event.location}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 size-5 shrink-0 text-primary" />
              <div><p className="text-sm text-muted-foreground">Volunteers</p><p className="font-semibold">{event.participantsCount || 0} joined so far</p></div>
            </div>
            <div className="hidden lg:block">{cta}</div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-base-300 bg-base-100/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        {cta}
      </div>
    </div>
  );
}
