import { Suspense } from "react";
import EventsView from "@/components/views/EventsView";
import { PageSkeleton } from "@/components/PrivateRoute";

export const metadata = { title: "Upcoming Events" };

export default function EventsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <EventsView />
    </Suspense>
  );
}
