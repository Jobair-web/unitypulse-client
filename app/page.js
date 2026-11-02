import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Gallery from "@/components/home/Gallery";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <UpcomingEvents />
      <Gallery />
      <Newsletter />
    </>
  );
}
