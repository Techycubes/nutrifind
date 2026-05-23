"use client";

import React from "react";

export default function SponsoredCard() {
  return (
    <div className="p-4 card soft-shadow border-l-4 border-green-500">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-zinc-100 rounded-md" />
          <div>
            <div className="text-xs font-medium text-green-600">Sponsored</div>
            <div className="font-medium">Placeholder Brand</div>
            <div className="text-sm text-zinc-500">A short promotional tagline.</div>
          </div>
        </div>
        <div>
          <button className="btn btn-outline">Shop Now</button>
        </div>
      </div>
    </div>
  );
}
