"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CalendarX, Search } from "lucide-react";
import { api } from "@/lib/api";
import EventsGrid from "@/components/EventsGrid";
import StateBox from "@/components/StateBox";
import { CONTAINER, EVENT_TYPES } from "@/lib/constants";

export default function EventsView() {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [debounced, setDebounced] = useState(search);
  const [type, setType] = useState("");
  const [sort, setSort] = useState("asc");
  const [state, setState] = useState({ loading: true, events: [], error: "" });

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    const q = new URLSearchParams({ sort });
    if (debounced.trim()) q.set("search", debounced.trim());
    if (type) q.set("type", type);
    api(`/events?${q}`)
      .then((d) => alive && setState({ loading: false, events: d.events, error: "" }))
      .catch((e) => alive && setState({ loading: false, events: [], error: e.message }));
    return () => {
      alive = false;
    };
  }, [debounced, type, sort]);

  const filtering = Boolean(debounced.trim() || type);

  return (
    <div className={`${CONTAINER} py-12 md:py-16`}>
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Upcoming events</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">Find a drive to join</h1>
        <p className="mt-3 text-muted-foreground">Only upcoming events are listed here. Past events move out of the way automatically.</p>
      </div>

      <div className="mb-8 grid gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-card md:grid-cols-[1fr_12rem_12rem]">
        <label className="flex h-12 items-center gap-2 rounded-xl border border-input px-3 focus-within:border-primary focus-within:outline-2 focus-within:outline-primary">
          <Search className="size-4 text-muted-foreground" />
          <span className="sr-only">Search events</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, area or cause"
            className="w-full bg-transparent text-base outline-none"
          />
        </label>
        <select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value)} className="select h-12 w-full rounded-xl border-input bg-base-100">
          <option value="">All types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select aria-label="Sort by date" value={sort} onChange={(e) => setSort(e.target.value)} className="select h-12 w-full rounded-xl border-input bg-base-100">
          <option value="asc">Soonest first</option>
          <option value="desc">Latest first</option>
        </select>
      </div>

      <EventsGrid
        loading={state.loading}
        events={state.events}
        error={state.error}
        empty={
          <StateBox
            icon={CalendarX}
            title={filtering ? "Nothing matches that search" : "No upcoming events yet"}
            text={filtering ? "Try a different area or clear the filters." : "Be the first to host a drive in your neighbourhood."}
            action={
              filtering ? (
                <button className="btn btn-primary rounded-full" onClick={() => { setSearch(""); setType(""); }}>Clear filters</button>
              ) : (
                <Link href="/events/create" className="btn btn-primary rounded-full">Create an event</Link>
              )
            }
          />
        }
      />
    </div>
  );
}
