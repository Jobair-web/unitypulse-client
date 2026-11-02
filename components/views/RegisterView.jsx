"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Circle, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Field, { inputClass } from "@/components/Field";
import { GoogleIcon, getRedirectTarget } from "@/components/views/LoginView";
import { PASSWORD_RULES, firstFailedRule, isEmail, isValidUrl } from "@/lib/utils";

export default function RegisterView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [values, setValues] = useState({ name: "", email: "", image: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (session) router.replace(getRedirectTarget());
  }, [session, router]);

  const change = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (values.name.trim().length < 2) found.name = "Please tell us your name.";
    if (!isEmail(values.email.trim())) found.email = "Enter a valid email address.";
    if (!values.image.trim()) found.image = "Add a link to your profile photo.";
    else if (!isValidUrl(values.image.trim())) found.image = "That link doesn't look right. Use a full URL starting with https://";
    const failedRule = firstFailedRule(values.password);
    if (failedRule) found.password = failedRule.hint;

    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      // Password rules get their own toast, as required
      if (failedRule) toast.error(failedRule.title, { description: failedRule.hint });
      else toast.error("Let's fix a few things", { description: "Check the highlighted fields and try again." });
      document.getElementById(first)?.focus();
      return;
    }

    setPending(true);
    const { error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      image: values.image.trim(),
    });
    setPending(false);
    if (error) {
      toast.error("We couldn't create your account", {
        description: error.message || "That email may already be registered. Try logging in instead.",
      });
      return;
    }
    toast.success(`Welcome to UnityPulse, ${values.name.trim().split(" ")[0]}`, {
      description: "Your account is ready. Let's find a drive to join.",
    });
    router.push(getRedirectTarget());
  }

  async function handleGoogle() {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: getRedirectTarget() });
    if (error) toast.error("Google login isn't available", { description: "Please register with your email instead." });
  }

  return (
    <section className="bg-mesh grid min-h-[calc(100svh-4rem)] place-items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/50 bg-base-100/85 p-6 shadow-card backdrop-blur-2xl dark:border-white/10 md:p-8">
        <div>
          <h1 className="text-3xl font-bold">Join your neighbours</h1>
          <p className="mt-1 text-muted-foreground">Create an account to host and join drives.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <Field id="name" label="Full name" required error={errors.name}>
            <input id="name" autoComplete="name" className={inputClass(errors.name)} value={values.name} onChange={change("name")} placeholder="Nadia Rahman" />
          </Field>
          <Field id="email" label="Email" required error={errors.email}>
            <input id="email" type="email" autoComplete="email" className={inputClass(errors.email)} value={values.email} onChange={change("email")} placeholder="you@example.com" />
          </Field>
          <Field id="image" label="Photo URL" required error={errors.image} hint="A link to your profile picture (https://...).">
            <input id="image" type="url" className={inputClass(errors.image)} value={values.image} onChange={change("image")} placeholder="https://example.com/me.jpg" />
          </Field>
          <Field id="password" label="Password" required error={errors.password}>
            <div className="relative">
              <input id="password" type={show ? "text" : "password"} autoComplete="new-password" className={`${inputClass(errors.password)} pr-12`} value={values.password} onChange={change("password")} placeholder="Create a password" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <ul className="mt-1 grid gap-1 text-sm" aria-label="Password requirements">
              {PASSWORD_RULES.map((r) => {
                const met = r.test(values.password);
                return (
                  <li key={r.id} className={`flex items-center gap-2 ${met ? "text-success" : "text-muted-foreground"}`}>
                    {met ? <Check className="size-4" /> : <Circle className="size-4" />}
                    {r.label}
                  </li>
                );
              })}
            </ul>
          </Field>
          <button type="submit" disabled={pending} aria-busy={pending} className="btn btn-primary h-12 rounded-full font-semibold">
            {pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>
        <div className="divider text-xs text-muted-foreground">or</div>
        <button type="button" onClick={handleGoogle} className="btn btn-outline h-12 w-full rounded-full">
          <GoogleIcon /> Continue with Google
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already a member?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </section>
  );
}
