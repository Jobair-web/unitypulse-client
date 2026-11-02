"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";

/** Fills its (relative) parent. Shows a branded gradient if the image is missing or broken. */
export default function SafeImage({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className="absolute inset-0 grid place-items-center bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 text-white/70"
      >
        <HeartHandshake className="size-10" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`absolute inset-0 size-full object-cover ${className}`}
    />
  );
}
