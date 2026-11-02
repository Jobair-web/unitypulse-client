import SafeImage from "@/components/SafeImage";
import SectionHeading from "@/components/SectionHeading";
import { CONTAINER } from "@/lib/constants";
import { GALLERY } from "@/lib/images";

export default function Gallery() {
  return (
    <section className={`${CONTAINER} py-16 md:py-24`}>
      <SectionHeading
        center
        eyebrow="Moments of kindness"
        title="Our community in action"
        subtitle="A few snapshots from drives, cleanups and plantations organised by neighbours like you."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {GALLERY.map((item, i) => (
          <figure key={i} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-base-300 shadow-card">
            <SafeImage
              src={item.src}
              alt={item.caption}
              className="transition-transform duration-500 motion-safe:group-hover:scale-105 dark:brightness-90"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-sm font-medium text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
