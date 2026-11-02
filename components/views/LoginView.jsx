"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Field, { inputClass } from "@/components/Field";
import { isEmail } from "@/lib/utils";

export function getRedirectTarget() {
  if (typeof window === "undefined") return "/";
  const target = new URLSearchParams(window.location.search).get("redirect") || "/";
  return target.startsWith("/") && !target.startsWith("//") ? target : "/";
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.27c0-.8-.07-1.56-.2-2.3H12v4.35h5.9a5.04 5.04 0 0 1-2.19 3.31v2.75h3.54c2.07-1.9 3.25-4.72 3.25-8.11z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.67l-3.54-2.75c-.98.66-2.24 1.05-3.74 1.05-2.87 0-5.3-1.94-6.17-4.55H2.17v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.83 14.08a6.6 6.6 0 0 1 0-4.16V7.08H2.17a11 11 0 0 0 0 9.84l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.17 7.08l3.66 2.84C6.7 7.32 9.13 5.38 12 5.38z" />
    </svg>
  );
}

export default function LoginView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (session) router.replace(getRedirectTarget());
  }, [session, router]);

  const change = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (!isEmail(values.email.trim())) found.email = "Enter the email you registered with.";
    if (!values.password) found.password = "Enter your password.";
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setPending(true);
    const { data, error } = await authClient.signIn.email({ email: values.email.trim(), password: values.password });
    setPending(false);
    if (error || !data) {
      toast.error("That didn't match", { description: "Double-check your email and password and try again." });
      return;
    }
    toast.success(`Welcome back, ${data.user?.name?.split(" ")[0] || "friend"}`, {
      description: "Let's find something good to join today.",
    });
    router.push(getRedirectTarget());
  }

  async function handleGoogle() {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: getRedirectTarget() });
    if (error) toast.error("Google login isn't available", { description: "Please use your email and password instead." });
  }

  return (
    <section className="bg-mesh grid min-h-[calc(100svh-4rem)] place-items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/50 bg-base-100/85 p-6 shadow-card backdrop-blur-2xl dark:border-white/10 md:p-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-muted-foreground">Log in to join drives and host your own.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <Field id="email" label="Email" required error={errors.email}>
            <input id="email" type="email" autoComplete="email" className={inputClass(errors.email)} value={values.email} onChange={change("email")} placeholder="you@example.com" />
          </Field>
          <Field id="password" label="Password" required error={errors.password}>
            <div className="relative">
              <input id="password" type={show ? "text" : "password"} autoComplete="current-password" className={`${inputClass(errors.password)} pr-12`} value={values.password} onChange={change("password")} placeholder="Your password" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
          <button type="submit" disabled={pending} aria-busy={pending} className="btn btn-primary h-12 rounded-full font-semibold">
            {pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
            {pending ? "Logging in…" : "Login"}
          </button>
        </form>
        <div className="divider text-xs text-muted-foreground">or</div>
        <button type="button" onClick={handleGoogle} className="btn btn-outline h-12 w-full rounded-full">
          <GoogleIcon /> Continue with Google
        </button>
        <p className="text-center text-sm text-muted-foreground">
          New to UnityPulse?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
