"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import Avatar from "@/components/Avatar";
import Field, { inputClass } from "@/components/Field";
import { authClient } from "@/lib/auth-client";
import { CONTAINER } from "@/lib/constants";
import { isValidUrl } from "@/lib/utils";

function Content() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [values, setValues] = useState({ name: "", image: "" });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) setValues({ name: user.name || "", image: user.image || "" });
  }, [user]);

  const change = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (values.name.trim().length < 2) found.name = "Please enter your name.";
    if (values.image.trim() && !isValidUrl(values.image.trim())) found.image = "That link doesn't look right. Use a full URL starting with https://";
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setPending(true);
    const { error } = await authClient.updateUser({ name: values.name.trim(), image: values.image.trim() || undefined });
    setPending(false);
    if (error) {
      toast.error("Couldn't update your profile", { description: error.message || "Please try again." });
      return;
    }
    toast.success("Profile updated", { description: "Your new name and photo are live." });
  }

  return (
    <div className={`${CONTAINER} py-12 md:py-16`}>
      <div className="mx-auto max-w-xl space-y-8">
        <div className="flex items-center gap-4">
          <Avatar user={{ ...user, name: values.name || user?.name, image: values.image }} className="size-20 text-2xl" />
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-bold">{user?.name}</h1>
            <p className="truncate text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-card md:p-8">
          <Field id="name" label="Display name" required error={errors.name}>
            <input id="name" className={inputClass(errors.name)} value={values.name} onChange={change("name")} />
          </Field>
          <Field id="image" label="Profile photo URL" error={errors.image} hint="Paste a link to a square photo.">
            <input id="image" type="url" className={inputClass(errors.image)} value={values.image} onChange={change("image")} placeholder="https://example.com/me.jpg" />
          </Field>
          <button type="submit" disabled={pending} aria-busy={pending} className="btn btn-primary h-12 rounded-full font-semibold">
            {pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
            {pending ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfileView() {
  return (
    <PrivateRoute>
      <Content />
    </PrivateRoute>
  );
}
