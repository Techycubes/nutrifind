"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname() || "/";

  const base = "btn flex flex-col items-center gap-1 py-2 px-4 rounded-md";
  const activeClass = "btn-primary";
  const inactiveClass = "btn-ghost hover:bg-gray-50";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--card-bg)] border-t p-2 flex justify-around">
      <button className={`${base} ${isActive("/results") ? activeClass : inactiveClass}`} onClick={() => router.push("/results")} aria-label="Search">
        <span>🔍</span>
        <span className="text-sm">Search</span>
      </button>
      <button className={`${base} ${isActive("/results") ? activeClass : inactiveClass}`} onClick={() => router.push("/results")} aria-label="Goals">
        <span>🎯</span>
        <span className="text-sm">Goals</span>
      </button>
      <button className={`${base} ${isActive("/plate") ? activeClass : inactiveClass}`} onClick={() => router.push("/plate")} aria-label="My Plate">
        <span>🍽️</span>
        <span className="text-sm">My Plate</span>
      </button>
    </nav>
  );
}
