// One heading style used by every section (keeps font, size and colour consistent).
export default function SectionHeading({ eyebrow, title, subtitle, center = false, action }) {
  return (
    <div className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${center ? "items-center text-center sm:flex-col sm:items-center" : ""}`}>
      <div className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-base leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
