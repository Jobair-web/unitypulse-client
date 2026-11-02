import Link from "next/link";
import { Facebook, Instagram, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { CONTAINER } from "@/lib/constants";

// The new X logo (replaces the old Twitter bird)
function XLogo({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "UnityPulse on X", href: "https://x.com", icon: <XLogo /> },
  { label: "UnityPulse on Facebook", href: "https://facebook.com", icon: <Facebook className="size-5" /> },
  { label: "UnityPulse on Instagram", href: "https://instagram.com", icon: <Instagram className="size-5" /> },
  { label: "UnityPulse on LinkedIn", href: "https://linkedin.com", icon: <Linkedin className="size-5" /> },
  { label: "UnityPulse on GitHub", href: "https://github.com", icon: <Github className="size-5" /> },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-emerald-50">
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 -left-24 size-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className={`${CONTAINER} relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4`}>
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-6 text-emerald-100/80">
            A neighbourhood notice board for good deeds. Find a drive, host one, and show up for the people next door.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-amber-400 hover:text-emerald-950"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-300">Explore</h2>
          <ul className="space-y-2.5 text-sm text-emerald-100/80">
            <li><Link className="hover:text-white" href="/">Home</Link></li>
            <li><Link className="hover:text-white" href="/events">Upcoming Events</Link></li>
            <li><Link className="hover:text-white" href="/events/create">Host an event</Link></li>
            <li><Link className="hover:text-white" href="/events/joined">My joined events</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-300">What we do</h2>
          <ul className="space-y-2.5 text-sm text-emerald-100/80">
            <li>Winter clothes drives</li>
            <li>Blanket distributions</li>
            <li>Beach and park cleanups</li>
            <li>Plantation and health camps</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-300">Say hello</h2>
          <ul className="space-y-3 text-sm text-emerald-100/80">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" /> Mirpur 10, Dhaka 1216, Bangladesh</li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0 text-amber-300" /> hello@unitypulse.dev</li>
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0 text-amber-300" /> +880 1700 000000</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className={`${CONTAINER} flex flex-col items-center justify-between gap-2 py-5 text-sm text-emerald-100/70 sm:flex-row`}>
          <p>© {new Date().getFullYear()} UnityPulse. Made with care for our neighbourhoods.</p>
          <p>Small acts, shared widely.</p>
        </div>
      </div>
    </footer>
  );
}
