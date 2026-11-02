"use client";

import { useState } from "react";

export default function Avatar({ user, className = "size-9" }) {
  const [failed, setFailed] = useState(false);
  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (user?.image && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={user.image}
        alt={user.name || "Profile picture"}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${className} rounded-full object-cover`}
      />
    );
  }
  return (
    <span className={`${className} grid place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary`}>
      {initials}
    </span>
  );
}
