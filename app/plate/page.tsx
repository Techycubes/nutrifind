"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";

type PlateItem = { id: string; name: string; calories?: number; protein?: number };

export default function PlatePage() {
  const auth = useAuth();
  const [items, setItems] = useState<PlateItem[]>([]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/plate");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setItems(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [auth.isAuthenticated]);

  async function removeItem(id: string) {
    try {
      const res = await fetch("/api/plate", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
      if (!res.ok) return;
      setItems((s) => s.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Plate</h1>
        <div className="muted mb-4">You need an account to access My Plate.</div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => auth.openAuthModal("login")}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Plate</h1>
      <div className="space-y-3">
        {items.length === 0 && <div className="muted">No items yet.</div>}
        {items.map((it) => (
          <div key={it.id} className="p-3 card soft-shadow flex justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm muted">{it.calories ?? "—"} kcal</div>
            </div>
            <button className="text-red-600" onClick={() => removeItem(it.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
