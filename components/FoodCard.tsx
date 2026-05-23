"use client";

import React, { useState } from "react";
import { scoreProduct } from "../lib/scoring";
import ProductAnalysis from "./ProductAnalysis";
import { useAuth } from "./AuthProvider";

export default function FoodCard({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const auth = useAuth();
  // product may be nested under "product" when returned from product API
  const p = product.product ?? product;
  const scored = scoreProduct(p);

  return (
    <div className="p-4 card soft-shadow flex items-center gap-4 relative">
      <img src={p.image_url || "/vercel.svg"} alt={p.product_name || "item"} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className="font-medium">{p.product_name || p.name || "Unknown"}</div>
        <div className="text-sm muted">{p.brands}</div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: scored.color, color: "white" }}>
          <div className="text-sm font-bold">{scored.score}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button className="btn btn-outline" onClick={() => setOpen(true)} aria-label={`Analyze ${p.product_name || p.name}`}>
            Analyze
          </button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  if (!auth.isAuthenticated) return auth.openAuthModal("login");
                  const entry = {
                    externalId: p.code ?? null,
                    name: p.product_name ?? p.name ?? "Item",
                    calories: Number(p.nutriments?.["energy-kcal_100g"] ?? p.nutriments?.["energy_100g"] ?? 0) || null,
                    protein: Number(p.nutriments?.["proteins_100g"] ?? 0) || null,
                  };
                  const res = await fetch('/api/plate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
                  if (res.status === 401) return auth.openAuthModal('login');
                  if (!res.ok) throw new Error('Failed to add');
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                } catch (e) {
                  console.error(e);
                }
              }}
              aria-label={`Add ${p.product_name || p.name} to plate`}
            >
              Add to Plate
            </button>
        </div>
      </div>
      {open && <ProductAnalysis product={p} scored={scored} onClose={() => setOpen(false)} />}
      {added && <div className="badge" style={{ position: "absolute", right: 12, top: 8, background: "rgba(9,105,218,0.08)", color: "var(--primary)" }}>Added</div>}
    </div>
  );
}
