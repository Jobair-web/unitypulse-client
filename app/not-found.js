import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60vh] w-full max-w-xl place-items-center px-4 py-20 text-center">
      <div className="space-y-5">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="size-8" />
        </div>
        <h1 className="text-4xl font-bold">We couldn't find that page</h1>
        <p className="text-muted-foreground">
          The link may be old, or the event may have been removed. Let's get you back to something good.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary rounded-full">Back to home</Link>
          <Link href="/events" className="btn btn-outline btn-primary rounded-full">Browse events</Link>
        </div>
      </div>
    </section>
  );
}
