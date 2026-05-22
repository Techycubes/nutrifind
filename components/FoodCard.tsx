"use client";

import React, { useState } from "react";
import { scoreProduct } from "../lib/scoring";
import ProductAnalysis from "./ProductAnalysis";

export default function FoodCard({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  // product may be nested under "product" when returned from product API
  const p = product.product ?? product;
  const scored = scoreProduct(p);

  return (
    <div className="p-4 rounded-2xl shadow bg-white flex items-center gap-4">
      <img src={p.image_url || "/vercel.svg"} alt={p.product_name || "item"} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className="font-medium">{p.product_name || p.name || "Unknown"}</div>
        <div className="text-sm text-zinc-500">{p.brands}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: scored.color, color: "white" }}>
          <div className="text-sm font-bold">{scored.score}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button className="text-sm text-blue-600" onClick={() => setOpen(true)}>
            Analyze
          </button>
          <button
            className="text-sm text-green-600"
            onClick={() => {
              try {
                const raw = localStorage.getItem("my_plate");
                const arr = raw ? JSON.parse(raw) : [];
                const entry = {
                  id: p.code ?? `${p.product_name ?? p.name}-${Date.now()}`,
                  name: p.product_name ?? p.name ?? "Item",
                  calories: p.nutriments?.["energy-kcal_100g"] ?? p.nutriments?.["energy_100g"] ?? undefined,
                  protein: p.nutriments?.["proteins_100g"] ?? undefined,
                };
                arr.push(entry);
                localStorage.setItem("my_plate", JSON.stringify(arr));
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Add to Plate
          </button>
        </div>
      </div>
      {open && <ProductAnalysis product={p} scored={scored} onClose={() => setOpen(false)} />}
      {added && <div className="absolute -translate-y-8 text-sm text-green-700">Added</div>}
    </div>
  );
}
