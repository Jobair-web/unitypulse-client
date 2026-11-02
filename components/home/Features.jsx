import { MapPin, PlusCircle, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { CONTAINER } from "@/lib/constants";

const FEATURES = [
  {
    icon: MapPin,
    tile: "bg-primary/10 text-primary",
    title: "Discover drives near you",
    text: "Browse winter clothes distributions, blanket drives and cleanups happening in your neighbourhood this month.",
  },
  {
    icon: PlusCircle,
    tile: "bg-secondary/10 text-secondary",
    title: "Host in under five minutes",
    text: "Add a name, a place and a date. We build the page so you can focus on the people.",
  },
  {
    icon: HeartHandshake,
    tile: "bg-accent/20 text-amber-800 dark:text-accent",
    title: "Show up. Make it count.",
    text: "Join with one tap, keep track of everything you've signed up for, and see who's with you.",
  },
];

export default function Features() {
  return (
    <section className={`${CONTAINER} py-16 md:py-24`}>
      <SectionHeading
        center
        eyebrow="Why UnityPulse"
        title="Everything a good deed needs, nothing it doesn't."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, tile, title, text }) => (
          <div
            key={title}
            className="flex h-full flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-card transition-all duration-300 hover:shadow-card-hover motion-safe:hover:-translate-y-1"
          >
            <div className={`grid size-12 place-items-center rounded-xl ${tile}`}>
              <Icon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold leading-snug">{title}</h3>
            <p className="leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
