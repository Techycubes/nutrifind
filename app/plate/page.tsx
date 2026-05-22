"use client";

import React, { useEffect, useState } from "react";

type PlateItem = { id: string; name: string; calories?: number; protein?: number };

export default function PlatePage() {
  const [items, setItems] = useState<PlateItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("my_plate");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("my_plate", JSON.stringify(items));
  }, [items]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Plate</h1>
      <div className="space-y-3">
        {items.length === 0 && <div className="text-zinc-500">No items yet.</div>}
        {items.map((it) => (
          <div key={it.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-zinc-500">{it.calories ?? "—"} kcal</div>
            </div>
            <button className="text-red-600" onClick={() => setItems(items.filter((x) => x.id !== it.id))}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
