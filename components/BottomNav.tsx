"use client";

import React from "react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around">
      <button className="flex flex-col items-center text-sm">
        <span>🔍</span>
        <span>Search</span>
      </button>
      <button className="flex flex-col items-center text-sm">
        <span>🎯</span>
        <span>Goals</span>
      </button>
      <button className="flex flex-col items-center text-sm">
        <span>🍽️</span>
        <span>My Plate</span>
      </button>
    </nav>
  );
}
