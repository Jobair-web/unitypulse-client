"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { CONTAINER } from "@/lib/constants";
import { isEmail } from "@/lib/utils";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!isEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast.success("You're on the list", { description: "We'll send you the best drives each week." });
  }

  return (
    <section className={`${CONTAINER} pb-16 md:pb-24`}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 px-6 py-12 text-white md:px-12 md:py-16">
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <Mail className="size-6 text-amber-300" />
            </span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Good news, once a week</h2>
            <p className="max-w-md leading-relaxed text-emerald-50/85">
              Get a short note with the upcoming drives near you. No spam, only people doing good things.
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={error ? "true" : undefined}
                className="input h-12 w-full flex-1 rounded-full border-0 bg-white px-5 text-base text-emerald-950 placeholder:text-emerald-900/60"
              />
              <button type="submit" className="btn h-12 rounded-full border-0 bg-amber-400 px-8 font-semibold text-emerald-950 hover:bg-amber-300">
                Subscribe
              </button>
            </div>
            {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
