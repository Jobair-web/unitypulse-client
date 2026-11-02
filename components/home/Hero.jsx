import Link from "next/link";
import { Heart } from "lucide-react";
import SearchForm from "@/components/home/SearchForm";
import SafeImage from "@/components/SafeImage";
import { CONTAINER } from "@/lib/constants";
import { GALLERY } from "@/lib/images";

const QUICK = [
  { label: "Winter clothes", q: "clothes" },
  { label: "Blanket drives", q: "blanket" },
  { label: "Beach cleanups", q: "beach" },
  { label: "Food packs", q: "food" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-mesh">
      <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10" />
      <div className={`${CONTAINER} grid items-center gap-12 pb-16 pt-12 md:pb-28 md:pt-20 lg:grid-cols-12`}>
        <div className="space-y-6 lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary motion-safe:animate-fade-up">
            <span aria-hidden="true">🌱</span> Winter drives are open across the city
          </span>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight motion-safe:animate-fade-up [animation-delay:100ms] sm:text-5xl lg:text-6xl">
            Where neighbours become{" "}
            <span className="relative text-primary">
              changemakers.
              <svg aria-hidden="true" viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full text-accent" fill="none">
                <path d="M3 8c60-6 140-8 294-2" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="max-w-prose text-lg leading-relaxed text-muted-foreground motion-safe:animate-fade-up [animation-delay:200ms]">
            Find a winter-clothes drive, a blanket collection or a beach cleanup near you, and show up alongside people who care.
          </p>
          <div className="max-w-2xl space-y-4 motion-safe:animate-fade-up [animation-delay:300ms]">
            <SearchForm />
            <div className="flex flex-wrap items-center gap-2">
              {QUICK.map((c) => (
                <Link key={c.label} href={`/events?search=${c.q}`} className="btn btn-outline btn-sm rounded-full">
                  {c.label}
                </Link>
              ))}
              <Link href="/events/create" className="btn btn-ghost btn-sm rounded-full text-primary">
                Host an event →
              </Link>
            </div>
          </div>
        </div>

        <div className="relative hidden h-[26rem] sm:block lg:col-span-5">
          <div className="absolute inset-0 bottom-16 right-24 overflow-hidden rounded-3xl shadow-card-hover">
            <SafeImage src={GALLERY[0].src} alt="Volunteers sorting winter clothes" className="dark:brightness-90" />
          </div>
          <div className="absolute right-0 top-10 h-52 w-40 overflow-hidden rounded-3xl border-4 border-base-200 shadow-card-hover">
            <SafeImage src={GALLERY[1].src} alt="Warm blankets ready to be handed out" className="dark:brightness-90" />
          </div>
          <div className="absolute bottom-0 left-6 flex items-center gap-3 rounded-2xl border border-white/40 bg-base-100/85 px-4 py-3 shadow-card backdrop-blur-md dark:border-white/10">
            <span className="grid size-10 place-items-center rounded-full bg-accent/25 text-amber-800 dark:text-accent">
              <Heart className="size-5" />
            </span>
            <p className="text-sm leading-tight">
              <strong className="block">New drives every week</strong>
              <span className="text-muted-foreground">Pick one and show up</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
