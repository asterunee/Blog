"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const repeatWindow = 30 * 60 * 1000;

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || navigator.doNotTrack === "1") return;
    const key = `asterunee-view:${pathname}`;
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < repeatWindow) return;
    sessionStorage.setItem(key, String(Date.now()));
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pathname }), keepalive: true }).catch(() => sessionStorage.removeItem(key));
  }, [pathname]);

  return null;
}
