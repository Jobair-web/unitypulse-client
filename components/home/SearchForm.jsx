"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchForm() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/events?search=${encodeURIComponent(term)}` : "/events");
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-2 rounded-3xl border border-white/50 bg-base-100/70 p-2 shadow-card backdrop-blur-2xl dark:border-white/10 sm:flex-row sm:items-center sm:rounded-full"
    >
      <label htmlFor="hero-search" className="sr-only">Search events by area or cause</label>
      <div className="flex flex-1 items-center gap-2 px-3">
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <input
          id="hero-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by area or cause, e.g. Mirpur 10"
          className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/80"
        />
      </div>
      <button type="submit" className="btn btn-primary h-12 rounded-full px-8 font-semibold">
        Find events
      </button>
    </form>
  );
}
