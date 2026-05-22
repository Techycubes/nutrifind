"use client";

import React, { useEffect, useState } from "react";
import type { ScoredProduct } from "../lib/types";

export default function ProductAnalysis({ product, scored, onClose }: { product: any; scored: ScoredProduct; onClose: () => void }) {
  const nutriments = product.nutriments || {};
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loadingAlts, setLoadingAlts] = useState(false);

  useEffect(() => {
    if ((scored?.score ?? 100) < 60) {
      const q = product.categories || product.categories_tags?.[0] || product.product_name || "";
      setLoadingAlts(true);
      fetch(`/api/alternatives?category=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => {
          setAlternatives(d.alternatives || d || []);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoadingAlts(false));
    }
  }, [product, scored]);

  function findNearMe() {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`/api/stores?lat=${lat}&lon=${lon}`);
          const data = await res.json();
          let items: any[] = [];
          if (data?.data && Array.isArray(data.data)) items = data.data;
          else if (data?.locations && Array.isArray(data.locations)) items = data.locations;
          else if (data?.items && Array.isArray(data.items)) items = data.items;
          else if (Array.isArray(data)) items = data;
          else if (data) items = [data];
          setStores(items);
        } catch (e) {
          console.error(e);
        }
      },
      (err) => {
        console.error(err);
        alert("Unable to get location");
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-lg max-h-[90vh] overflow-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: scored.color, color: "white", fontSize: 20, fontWeight: 700 }}>
              {scored.score}
            </div>
            <div>
              <div className="font-bold text-lg">{product.product_name || product.name}</div>
              <div className="text-sm text-zinc-500">{product.brands}</div>
            </div>
          </div>
          <button className="text-gray-600" onClick={onClose}>Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <details className="p-3 border rounded">
            <summary className="font-medium">What's Good</summary>
            <ul className="mt-2 list-disc pl-5">
              {scored.positives.length ? scored.positives.map((s) => <li key={s}>{s}</li>) : <li>None listed</li>}
            </ul>
          </details>

          <details className="p-3 border rounded">
            <summary className="font-medium">Watch Out</summary>
            <ul className="mt-2 list-disc pl-5">
              {scored.warnings.length ? scored.warnings.map((s) => <li key={s}>{s}</li>) : <li>None listed</li>}
            </ul>
          </details>

          <details className="p-3 border rounded">
            <summary className="font-medium">Additives</summary>
            <ul className="mt-2 list-disc pl-5">
              {scored.additives.length ? scored.additives.map((a) => (
                <li key={a.name}>{a.name} — {a.risk}</li>
              )) : <li>None listed</li>}
            </ul>
          </details>

          <div className="p-3 border rounded">
            <div className="font-medium mb-2">Nutrition per 100g</div>
            <table className="w-full text-sm">
              <tbody>
                <tr><td>Calories</td><td className="text-right">{nutriments["energy-kcal_100g"] ?? nutriments["energy_100g"] ?? nutriments["energy"] ?? "—"}</td></tr>
                <tr><td>Protein</td><td className="text-right">{nutriments["proteins_100g"] ?? nutriments["proteins"] ?? "—"}</td></tr>
                <tr><td>Carbs</td><td className="text-right">{nutriments["carbohydrates_100g"] ?? "—"}</td></tr>
                <tr><td>Sugars</td><td className="text-right">{nutriments["sugars_100g"] ?? "—"}</td></tr>
                <tr><td>Fat</td><td className="text-right">{nutriments["fat_100g"] ?? "—"}</td></tr>
                <tr><td>Saturated fat</td><td className="text-right">{nutriments["saturated-fat_100g"] ?? nutriments["saturated_fat_100g"] ?? "—"}</td></tr>
                <tr><td>Fiber</td><td className="text-right">{nutriments["fiber_100g"] ?? "—"}</td></tr>
                <tr><td>Sodium</td><td className="text-right">{nutriments["sodium_100g"] ?? "—"}</td></tr>
              </tbody>
            </table>
          </div>

          {scored.score < 60 && (
            <div className="p-3 border rounded">
              <div className="font-medium mb-2">Better Options</div>
              {loadingAlts && <div>Loading alternatives…</div>}
              {!loadingAlts && alternatives.length === 0 && <div className="text-zinc-500">No alternatives found.</div>}
              {!loadingAlts && alternatives.length > 0 && (
                <div className="space-y-2">
                  {alternatives.map((a: any, i: number) => (
                    <div key={i} className="p-2 border rounded flex justify-between items-center">
                      <div className="text-sm">{a.product?.product_name ?? a.product?.name ?? a.product}</div>
                      <div className="text-sm font-bold">{a.score?.score ?? "—"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-3 border rounded">
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={findNearMe}>Find Near Me</button>
            {stores.length > 0 && (
              <div className="mt-3 space-y-2">
                {stores.map((s, idx) => (
                  <div key={idx} className="p-2 border rounded text-sm">
                    {s?.name ?? s?.properties?.name ?? s?.locationName ?? JSON.stringify(s)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
