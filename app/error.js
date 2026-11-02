"use client";

export default function Error({ reset }) {
  return (
    <section className="mx-auto grid min-h-[60vh] w-full max-w-xl place-items-center px-4 py-20 text-center">
      <div className="space-y-5">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          That wasn't supposed to happen. Please try again, and if it keeps happening come back in a few minutes.
        </p>
        <button onClick={() => reset()} className="btn btn-primary rounded-full">Try again</button>
      </div>
    </section>
  );
}
