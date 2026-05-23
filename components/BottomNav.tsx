"use client";

import React from "react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around">
      <button className="btn btn-ghost flex flex-col items-center gap-1 py-2 px-4 rounded-md hover:bg-gray-50" aria-label="Search">
        <span>🔍</span>
        <span className="text-sm">Search</span>
      </button>
      <button className="btn btn-ghost flex flex-col items-center gap-1 py-2 px-4 rounded-md hover:bg-gray-50" aria-label="Goals">
        <span>🎯</span>
        <span className="text-sm">Goals</span>
      </button>
      <button className="btn btn-ghost flex flex-col items-center gap-1 py-2 px-4 rounded-md hover:bg-gray-50" aria-label="My Plate">
        <span>🍽️</span>
        <span className="text-sm">My Plate</span>
      </button>
    </nav>
  );
}
