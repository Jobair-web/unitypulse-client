import { authClient } from "@/lib/auth-client";

const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

/**
 * Small fetch wrapper for the Express API.
 * auth: true attaches a fresh Better Auth JWT as a Bearer token.
 */
export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  if (auth) {
    const { data } = await authClient.token();
    if (!data?.token) throw new Error("Please log in to continue.");
    headers.Authorization = `Bearer ${data.token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json.message || "Something went wrong. Please try again.");
    error.status = res.status;
    error.errors = json.errors;
    throw error;
  }
  return json;
}
