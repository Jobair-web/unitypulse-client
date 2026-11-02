"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import EventForm from "@/components/EventForm";
import { api } from "@/lib/api";
import { CONTAINER } from "@/lib/constants";

export default function CreateEventView() {
  const router = useRouter();

  async function handleCreate(values) {
    await api("/events", { method: "POST", body: values, auth: true });
    toast.success("Event published!", { description: `${values.title} is live. Neighbours can start joining.` });
    router.push("/events");
  }

  return (
    <PrivateRoute>
      <div className={`${CONTAINER} py-12 md:py-16`}>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold md:text-4xl">Create an event</h1>
          <p className="mb-8 mt-2 text-muted-foreground">Tell neighbours what, where and when. It takes about five minutes.</p>
          <EventForm onSubmit={handleCreate} submitLabel="Publish event" pendingLabel="Publishing…" onCancel={() => router.back()} />
        </div>
      </div>
    </PrivateRoute>
  );
}
